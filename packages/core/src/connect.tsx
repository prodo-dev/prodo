import * as React from "react";
import logger from "./logger";
import { Comp, Connect, Dispatch, Node, Store, Watch } from "./types";
import { joinPath, splitPath } from "./utils";
import { subscribe, unsubscribe } from "./watch";

export const ProdoContext = React.createContext<Store<any, any>>(null as any);

const pathSymbol = Symbol("path");
export const createUniverseWatcher = (universePath: string) => {
  const readProxy = (path: string[]): any =>
    new Proxy(
      {},
      {
        get: (_target, key) =>
          key === pathSymbol ? path : readProxy(path.concat([key.toString()])),
      },
    );

  return readProxy([universePath]);
};

const valueExtractor = (store: any, watched: any) => (x: any) => {
  const path = x[pathSymbol];
  const pathKey = joinPath(path);
  const value = path.reduce((x: any, y: any) => x[y], store.universe);
  watched[pathKey] = value;
  return value;
};

export const shallowEqual = (objA: any, objB: any): boolean => {
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

export type Func<P = {}> = (args: any) => React.ComponentType<P>;

export const connect: Connect<any> = <P extends {}>(
  func: any,
  name: string = "(anonymous)",
): React.ComponentType<P> =>
  class ConnectComponent<P> extends React.Component<P, any> {
    public static contextType = ProdoContext;

    public state: any;
    private watched: { [key: string]: any };
    private prevWatched: { [key: string]: any };
    private pathNodes: { [key: string]: Node };
    private compId: number;
    private comp: Comp;
    private name: string;
    private subscribe: (
      path: string[],
      unsubscribe?: (comp: Comp) => void,
    ) => void;
    private unsubscribe: (path: string[]) => void;
    private firstTime: boolean;
    private status: { unmounted: boolean };
    private store: Store<any, any>;

    private _renderFunc: any;
    private _watch: Watch;
    private _dispatch: Dispatch;
    private _state: any;

    private _viewCtx: any;

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

      this.comp = {
        name: this.name,
        compId: this.compId,
      };

      this.subscribe = (path: string[], unsubscribe?: (comp: Comp) => void) => {
        const pathKey = joinPath(path);
        const node: Node = {
          pathKey,
          status: this.status,
          setState,
          unsubscribe,
          ...this.comp,
        };

        this.pathNodes[pathKey] = node;
        subscribe(this.store, path, node);
      };

      this.unsubscribe = (path: string[]) => {
        const pathKey = joinPath(path);
        const node = this.pathNodes[pathKey];
        unsubscribe(this.store, path, node);
        delete this.pathNodes[pathKey];
      };

      this._watch = x => x;
      this._dispatch = func => (...args) =>
        this.store.exec(
          {
            id: this.name,
            parentId: null,
          },
          func,
          ...args,
        );

      this._renderFunc = (props: any): any => {
        return (func as ((args: any) => (props: any) => any))(this._viewCtx)(
          props,
        );
      };

      logger.info(`[constructing] ${this.name}`);
    }

    public componentDidMount() {
      logger.info(`[did mount] ${this.name}`);

      Object.keys(this.watched).forEach(pathKey => {
        logger.info(`[start watching] ${this.name}: < ${pathKey} >`);
        this.subscribe(splitPath(pathKey));
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
          this.subscribe(splitPath(pathKey));
        }
      });

      Object.keys(this.prevWatched).forEach(pathKey => {
        const keyDeleted = !this.watched.hasOwnProperty(pathKey);
        if (keyDeleted) {
          logger.info(`[update] ${this.name}: stop watching < ${pathKey} >`);
          this.unsubscribe(splitPath(pathKey));
        }
      });
    }

    public componentWillUnmount() {
      logger.info(`[will unmount]: ${this.name}`, this.state);
      Object.keys(this.state).forEach(pathKey => {
        logger.info(`[unmount] ${this.name}: stop watching < ${pathKey} >`);
        this.unsubscribe(splitPath(pathKey));
      });

      logger.debug("store", this.store);

      this.status.unmounted = true;
    }

    public render() {
      this.createViewCtx();

      const Comp = this._renderFunc;
      return <Comp {...this.props} />;
    }

    private createViewCtx() {
      this.store = this.context;
      this._state = createUniverseWatcher("state");
      this._watch = valueExtractor(this.store, this.watched);

      const ctx = {
        dispatch: this._dispatch,
        state: this._state,
        watch: this._watch,
        subscribe: this.subscribe,
      };

      this.store.plugins.forEach(p => {
        if (p.prepareViewCtx) {
          p.prepareViewCtx(
            ctx,
            this.store.config,
            this.store.universe,
            this.comp,
          );
        }
      });

      this._viewCtx = ctx;
    }
  };
