import {
  createPlugin,
  createUniverseWatcher,
  PluginActionCtxFn,
  PluginInitFn,
  PluginOnCompleteEventFn,
  PluginViewCtxFn,
  ProdoPlugin,
} from "@prodo/core";

export interface Local<T> {
  local: Partial<T>;
}

export interface Config<T> {
  localFixture?: Partial<T>;
  initLocal?: Partial<T>;
}
export type Universe<T> = Local<T>;
export type ActionCtx<T> = Local<T>;
export type ViewCtx<T> = Local<T>;

const prefix = "prodo:";

const isProdoKey = (key: string) => key.startsWith(prefix);
const serializeKey = (key: string) => `${prefix}${key}`;
const deserializeKey = (key: string) => {
  if (!isProdoKey(key)) {
    throw new Error(`${key.toString()} is not handled by prodo.`);
  }
  return key.slice(prefix.length);
};

const parseItem = (key: string, item: string): any => {
  try {
    return JSON.parse(item);
  } catch (e) {
    localStorage.removeItem(key);
    throw new Error(
      `Error parsing '${key.toString()}' from localStorage\n\n${item}`,
    );
  }
};

const getItem = <T>(config: Config<T>, key: string): any => {
  if (config.localFixture != null && config.localFixture.hasOwnProperty(key)) {
    // use fixtures
    return config.localFixture[key];
  }

  const prodoKey = serializeKey(key);
  const localItem = localStorage.getItem(prodoKey);
  if (localItem != null) {
    return parseItem(prodoKey, localItem);
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

  // init universe with values from localStorage (or fixtures) and initLocal
  const existingKeys =
    config.localFixture == null
      ? Object.keys(localStorage)
          .filter(isProdoKey)
          .map(deserializeKey)
      : Object.keys(config.localFixture);
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

const onCompleteEvent = <T>(): PluginOnCompleteEventFn<
  Config<T>,
  {},
  ActionCtx<T>
> => ({ event }, config) => {
  if (config.localFixture != null) {
    // do not update localStorage if using fixtures
    return;
  }

  const prevLocal: Universe<T> = event.prevUniverse.local;
  const nextLocal: Universe<T> = event.nextUniverse.local;

  // save everything on nextUniverse.local to localStorage
  Object.keys(nextLocal).forEach(pathKey => {
    const value = JSON.stringify(nextLocal[pathKey]);
    if (value != null) {
      localStorage.setItem(serializeKey(pathKey), value);
    } else {
      localStorage.removeItem(serializeKey(pathKey));
    }
  });

  // remove items that were deleted
  Object.keys(prevLocal).forEach(pathKey => {
    const keyDeleted = !nextLocal.hasOwnProperty(pathKey);
    if (keyDeleted) {
      localStorage.removeItem(serializeKey(pathKey));
    }
  });
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

export default localPlugin;
