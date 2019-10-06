import * as React from "react";
import logger from "./logger";
import { Comp, Connect, Node, Store } from "./types";
import { joinPath, splitPath } from "./utils";
import {
  subscribe as subscribeInner,
  unsubscribe as unsubscribeInner,
} from "./watch";

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

const state = createUniverseWatcher("state");

const useForceUpdate = () => {
  const [, setCounter] = React.useState(0);
  return React.useCallback(() => {
    setCounter(tick => tick + 1);
  }, []);
};

const getValue = (path: string[], obj: any): any =>
  path.reduce((x: any, y: any) => x && x[y], obj);

let _compIdCnt = 1;

export type Func<V, P = {}> = (viewCtx: V) => React.ComponentType<P>;

export const connect: Connect<any> = <P extends {}>(
  func: Func<any, P>,
  baseName: string = "(anonymous)",
): React.ComponentType<P> => (props: P) => {
  const compId = React.useRef(_compIdCnt++);
  const name = baseName + "." + compId.current;

  logger.info(`[rendering] ${name}`);

  const store = React.useContext(ProdoContext);
  const forceUpdate = useForceUpdate();

  // Subscribing to part of the state
  const status = React.useRef({ unmounted: false });
  React.useEffect(() => {
    logger.info(`[did mount] ${name}`);
    logger.debug("store", store);
  }, []);

  const pathNodes = React.useRef({});
  const subscribe = (path: string[], unsubscribe?: (comp: Comp) => void) => {
    const pathKey = joinPath(path);
    logger.info(`[subscribe] ${name} subscribing to ${pathKey}`);

    const node: Node =
      pathNodes.current[pathKey] ||
      (pathNodes.current[pathKey] = {
        pathKey,
        status: status.current,
        forceUpdate,
        unsubscribe,
        name,
        compId: compId.current,
      });

    subscribeInner(store, path, node);
  };
  const unsubscribe = (path: string[]) => {
    const pathKey = joinPath(path);
    const node = pathNodes.current[pathKey];
    if (node != null) {
      unsubscribeInner(store, path, node);
      delete pathNodes.current[pathKey];
    }
  };

  const eventIdCnt = React.useRef(0);
  const dispatch = func => (...args) =>
    store.exec(
      {
        id: `${name}/event.${eventIdCnt.current++}`,
        parentId: name,
      },
      func,
      ...args,
    );

  const watched = React.useRef({});
  const subscriptions = React.useRef({});
  // As we are rendering, create subscriptions
  const watch = React.useCallback(
    (proxy: any) => {
      const path = proxy[pathSymbol];
      const pathKey = joinPath(path);
      const value = getValue(path, store.universe);
      watched.current[pathKey] = true;
      if (!subscriptions.current[pathKey]) {
        subscriptions.current[pathKey] = true;
        subscribe(path);
      }
      return value;
    },
    [store],
  );

  // After updating, prune subscriptions
  React.useEffect(() => {
    Object.keys(watched.current).forEach(pathKey => {
      logger.info(`[update] ${name}: watching < ${pathKey} >`);
    });
    Object.keys(subscriptions.current).forEach(pathKey => {
      const keyDeleted = !watched.current.hasOwnProperty(pathKey);
      if (keyDeleted) {
        logger.info(`[update] ${name}: stop watching < ${pathKey} >`);
        unsubscribe(splitPath(pathKey));
      }
    });

    subscriptions.current = { ...watched.current };
    watched.current = {};
  });

  // On unmount, unsubscribe from everything
  React.useEffect(() => {
    return () => {
      logger.info(`[unmounting]: ${name}`, watched.current);
      Object.keys(subscriptions.current).forEach(pathKey => {
        logger.info(`[unmount] ${name}: stop watching < ${pathKey} >`);
        unsubscribe(splitPath(pathKey));
      });
      status.current = { unmounted: true };
    };
  }, []);

  const _subscribe = (path: string[], unsubscribe?: () => void): void => {
    const pathKey = joinPath(path);
    watched.current[pathKey] = getValue(path, store.universe);
    if (!subscriptions.current[pathKey]) {
      subscriptions.current[pathKey] = true;
      subscribe(path, unsubscribe);
    }
  };

  const ctx = React.useMemo(() => {
    const ctx = {
      dispatch,
      state,
      watch,
      subscribe: _subscribe,
    };
    store.plugins.forEach(p => {
      if (p._internals.viewCtx) {
        ctx.dispatch = dispatch;
        p._internals.viewCtx(
          {
            ctx,
            universe: store.universe,
            comp: {
              name,
              compId: compId.current,
            },
          },
          store.config,
        );
      }
    });
    return ctx;
  }, [store]);

  return (func as ((args: any) => (props: any) => any))(ctx)(props);
};

// export const shallowEqual = (objA: any, objB: any): boolean => {
//   if (Object.is(objA, objB)) {
//     return true;
//   }

//   if (
//     typeof objA !== "object" ||
//     objA === null ||
//     typeof objB !== "object" ||
//     objB === null
//   ) {
//     return false;
//   }

//   const keysA = Object.keys(objA);
//   const keysB = Object.keys(objB);

//   if (keysA.length !== keysB.length) {
//     return false;
//   }

//   // Test for A's keys different from B.
//   // tslint:disable-next-line:prefer-for-of
//   for (let i = 0; i < keysA.length; i++) {
//     if (
//       !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
//       !Object.is(objA[keysA[i]], objB[keysA[i]])
//     ) {
//       return false;
//     }
//   }

//   return true;
// };
// We're not applying any kind of `shouldComponentUpdate` any more.
// Previous code was:
//
// public shouldComponentUpdate(nextProps: P, nextState: any) {
//   const test =
//     !shallowEqual(this.props, nextProps) ||
//     (!this.firstTime && !shallowEqual(this.state, nextState));

//   logger.info(`[should update] ${this.name}`, test);
//   this.firstTime = false;

//   return test;
// }
