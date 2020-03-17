import {
  createPlugin,
  createUniverseWatcher,
  PluginActionCtxFn,
  PluginInitFn,
  PluginOnCompleteEventFn,
  PluginViewCtxFn,
  ProdoPlugin,
} from "@prodo/core";
import {
  createInMemoryLocalStorage,
  deserializeKey,
  isLocalStorageAvailable,
  isProdoKey,
  serializeKey,
} from "./utils";

export interface Local<T> {
  local: Partial<T>;
}

interface Store {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

export interface Config<T> {
  initLocal?: Partial<T>;
  overrideStorage?: Store;
}
export type Universe<T> = Local<T>;
export type ActionCtx<T> = Local<T>;
export type ViewCtx<T> = Local<T>;

const localStorage = isLocalStorageAvailable()
  ? window.localStorage
  : createInMemoryLocalStorage();

const parseItem = (store: Store, key: string, item: string): any => {
  try {
    return JSON.parse(item);
  } catch (e) {
    store.removeItem(key);
    throw new Error(
      `Error parsing '${key.toString()}' from localStorage\n\n${item}`,
    );
  }
};

const getItem = <T>(config: Config<T>, key: string): any => {
  const prodoKey = serializeKey(key);
  const store = config.overrideStorage || localStorage;
  const localItem = store.getItem(prodoKey);
  if (localItem != null) {
    return parseItem(store, prodoKey, localItem);
  }

  if (config.initLocal != null && config.initLocal.hasOwnProperty(key)) {
    return config.initLocal[key];
  }

  return undefined;
};

const initFn = <T>(): PluginInitFn<Config<T>, Universe<T>> => (
  config,
  universe,
) => {
  universe.local = {};

  const store = config.overrideStorage || localStorage;
  if (config.initLocal) {
    saveLocalStorage(store, config.initLocal, false);
  }

  // init universe with values from localStorage (or fixtures) and initLocal
  const existingKeys = Object.keys(store)
    .filter(isProdoKey)
    .map(deserializeKey);
  const defaultKeys = Object.keys(config.initLocal || {});
  const keys = Array.from(new Set([...existingKeys, ...defaultKeys]));

  universe.local = keys.reduce((acc, key) => {
    const item = getItem(config, key);

    if (item == null) {
      return acc;
    }

    return {
      ...acc,
      [key]: item,
    };
  }, {});

  // use initLocal for any values that have not yet been loaded
  if (config.initLocal != null) {
    Object.keys(config.initLocal).forEach(key => {
      if (!universe.local.hasOwnProperty(key)) {
        universe.local[key] = config.initLocal![key];
      }
    });
  }
};

const prepareActionCtx = <T>(): PluginActionCtxFn<
  Config<T>,
  Universe<T>,
  ActionCtx<T>
> => ({ ctx, universe }, config) => {
  ctx.local = new Proxy(universe.local, {
    deleteProperty(target, key) {
      const ret = Reflect.deleteProperty(target, key);

      // place default value back in the universe so it is available
      // in components
      if (config.initLocal && config.initLocal.hasOwnProperty(key)) {
        target[key] = config.initLocal[key];
      }

      return ret;
    },
  });
};

const prepareViewCtx = <T>(): PluginViewCtxFn<
  Config<T>,
  Universe<T>,
  ActionCtx<T>,
  ViewCtx<T>
> => ({ ctx }) => {
  ctx.local = createUniverseWatcher("local");
};

const saveLocalStorage = (store, newValues, overrideExisting = true) => {
  Object.keys(newValues).forEach(pathKey => {
    const value = newValues[pathKey];
    const key = serializeKey(pathKey);
    const existing = store.getItem(key);
    if (value != null && (existing == null || overrideExisting)) {
      store.setItem(key, JSON.stringify(value));
    } else if (overrideExisting) {
      store.removeItem(key);
    }
  });
};

const onCompleteEvent = <T>(): PluginOnCompleteEventFn<
  Config<T>,
  {},
  ActionCtx<T>
> => ({ event }, config) => {
  const prevLocal: Universe<T> = event.prevUniverse.local;
  const nextLocal: Universe<T> = event.nextUniverse.local;

  const store = config.overrideStorage || localStorage;
  // save everything on nextUniverse.local to localStorage
  const update = {
    ...Object.keys(prevLocal).reduce(
      (acc, pathKey) =>
        !nextLocal.hasOwnProperty(pathKey) ? { ...acc, [pathKey]: null } : acc,
      {},
    ),
    ...nextLocal,
  };
  saveLocalStorage(store, update);
};

const localPlugin = <T>(): ProdoPlugin<
  Config<T>,
  Universe<T>,
  ActionCtx<T>,
  ViewCtx<T>
> => {
  const plugin = createPlugin<Config<T>, Universe<T>, ActionCtx<T>, ViewCtx<T>>(
    "local",
  );

  plugin.init(initFn<T>());
  plugin.prepareActionCtx(prepareActionCtx<T>());
  plugin.prepareViewCtx(prepareViewCtx<T>());
  plugin.exposeUniverseVars(["local"]);
  plugin.onCompleteEvent(onCompleteEvent<T>());

  return plugin;
};

export { createInMemoryLocalStorage };

export default localPlugin;
