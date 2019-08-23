import * as React from "react";
import logger from "./logger";
import { Connect, Dispatch, Node, Store, Watch } from "./types";
import { splitPath } from "./utils";
import { subscribe, unsubscribe } from "./watch";

export const ProdoContext = React.createContext<Store<any, any>>(null as any);

const readProxy = (path: string[] = []): any =>
  new Proxy(
    {},
    {
      get: (_target: any, key: string) =>
        key === "_path" ? path : readProxy(path.concat([key])),
    },
  );

const valueExtractor = (store: any, watched: any, prefixPath: any = []) => (
  x: any,
) => {
  const path = prefixPath.concat(x._path);
  const pathKey = path.join("・");
  const value = path.reduce((x: any, y: any) => x[y], store.universe);
  watched[pathKey] = value;
  return value;
};

const shallowEqual = (objA: any, objB: any): boolean => {
  if (objA === objB) {
    return true;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!objB.hasOwnProperty(key) || objA[key] !== objB[key]) {
      return false;
    }
  }
  return true;
};

let _compIdCnt = 1;

export interface ConnectArgs<S> {
  state: S;
  watch: Watch;
  dispatch: Dispatch;
}

export type Func<S, P = {}> = (args: ConnectArgs<S>) => React.ComponentType<P>;

export const connect: Connect<any> = <P extends {}>(
  func: any,
  name: string = "(anonymous)",
): React.ComponentType<P> =>
  class ConnectComponent<P> extends React.Component<P> {
    public static contextType = ProdoContext;

    public state: any;
    private watched: { [key: string]: any };
    private prevWatched: { [key: string]: any };
    private pathNodes: { [key: string]: Node };
    private compId: number;
    private name: string;
    private subscribe: (pathKey: string) => void;
    private unsubscribe: (pathKey: string) => void;
    private firstTime: boolean;
    private status: { unmounted: boolean };
    private store: Store<any, any>;

    private _renderFunc: any;
    private _watch: Watch;
    private _dispatch: Dispatch;
    private _state: any;

    constructor(props: P) {
      super(props);

      this.state = {};
      this.watched = {};
      this.prevWatched = {};
      this.pathNodes = {};
      this.firstTime = true;
      this.compId = _compIdCnt++;
      this.name = name + "." + this.compId;

      const setState = this.setState.bind(this);
      this.status = { unmounted: false };

      this.subscribe = (pathKey: string) => {
        const node: Node = {
          name: this.name,
          setState,
          pathKey,
          status: this.status,
          compId: this.compId,
        };

        this.pathNodes[pathKey] = node;
        subscribe(this.store, splitPath(pathKey), node);
      };

      this.unsubscribe = (pathKey: string) => {
        const node = this.pathNodes[pathKey];
        unsubscribe(this.store, splitPath(pathKey), node);
        delete this.pathNodes[pathKey];
      };

      this._watch = x => x;
      this._dispatch = func => args =>
        this.store.exec(func, args, {
          id: this.name,
          parentId: null,
        });

      this._renderFunc = (props: any): any => {
        return (func as ((args: any) => (props: any) => any))({
          state: this._state,
          watch: this._watch,
          dispatch: this._dispatch,
        })(props);
      };

      logger.info(`[constructing] ${this.name}`);
    }

    public componentDidMount() {
      logger.info(`[did mount] ${this.name}`);

      Object.keys(this.watched).forEach(pathKey => {
        logger.info(`[start watching] ${this.name}: < ${pathKey} >`);
        this.subscribe(pathKey);
      });

      logger.debug("store", this.store);

      this.prevWatched = { ...this.watched };
      this.firstTime = true;
      this.setState(this.watched);
      this.watched = {};
    }

    public shouldComponentUpdate(nextProps: P, nextState: any) {
      const test =
        !shallowEqual(this.props, nextProps) ||
        (!this.firstTime && !shallowEqual(this.state, nextState));

      logger.info(`[should update] ${this.name}`, test);
      this.firstTime = false;
      return test;
    }

    public componentDidUpdate() {
      logger.info(`[did update] ${this.name}`);

      Object.keys(this.watched).forEach(pathKey => {
        const keyExisted = this.prevWatched.hasOwnProperty(pathKey);
        if (!keyExisted) {
          logger.info(`[update] ${this.name}: now watching < ${pathKey} >`);
          this.subscribe(pathKey);
        }
      });

      Object.keys(this.prevWatched).forEach(pathKey => {
        const keyDeleted = !this.watched.hasOwnProperty(pathKey);
        if (keyDeleted) {
          logger.info(`[update] ${this.name}: stop watching < ${pathKey} >`);
          this.unsubscribe(pathKey);
        }
      });
    }

    public componentWillUnmount() {
      logger.info(`[will unmount]: ${this.name}`, this.state);
      Object.keys(this.state).forEach(pathKey => {
        logger.info(`[unmount] ${this.name}: stop watching < ${pathKey} >`);
        this.unsubscribe(pathKey);
      });

      logger.debug("store", this.store);

      this.status.unmounted = true;
    }

    public render() {
      this.store = this.context;
      this._state = readProxy();
      this._watch = valueExtractor(this.store, this.watched, ["state"]);

      const Comp = this._renderFunc;
      return <Comp {...this.props} />;
    }
  };
