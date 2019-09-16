import {
  createPlugin,
  createUniverseWatcher,
  PluginActionCtxFn,
  PluginInitFn,
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

const parseItem = (key: string, item: string): any => {
  try {
    return JSON.parse(item);
  } catch (e) {
    throw new Error(
      `Error parsing '${key.toString()}' from localStorage\n\n${item}`,
    );
  }
};

const getItem = <T>(config: Config<T>, key: string): any => {
  if (config.localFixture != null && config.localFixture[key] != null) {
    // use fixtures
    return parseItem(key, JSON.stringify(config.localFixture[key]));
  }

  const localItem = localStorage.getItem(key);
  if (localItem != null) {
    return parseItem(key, localItem);
  }

  return undefined;
};

const keyExists = <T>(config: Config<T>, key: string): boolean => {
  if (config.localFixture) {
    return Object.keys(config.localFixture).includes(key);
  }

  return Object.keys(localStorage).includes(key);
};

const initFn = <T>(): PluginInitFn<Config<T>, Universe<T>> => (
  config,
  universe,
) => {
  universe.local = {};

  // init universe with values from localStorage or fixtures
  const keys =
    config.localFixture == null
      ? Object.keys(localStorage)
      : Object.keys(config.localFixture);

  universe.local = keys.reduce((acc, key) => {
    const item =
      config.localFixture == null
        ? localStorage.getItem(key)
        : JSON.stringify(config.localFixture[key]);

    if (item == null) {
      return acc;
    }

    return { ...acc, [key]: parseItem(key, item) };
  }, {});

  // use initLocal for any values that have not yet been loaded
  if (config.initLocal != null) {
    Object.keys(config.initLocal).forEach(key => {
      if (!universe.local[key]) {
        universe.local[key] = config.initLocal![key];
      }
    });
  }
};

const prepareActionCtxFn = <T>(): PluginActionCtxFn<
  Config<T>,
  Universe<T>,
  ActionCtx<T>
> => ({ ctx, universe }, config: Config<T>) => {
  ctx.local = new Proxy(
    {},
    {
      get(_target, key) {
        // key does not exist, return undefined
        if (!keyExists<T>(config, key.toString())) {
          // attempt to use initLocal
          if (config.initLocal) {
            return config.initLocal[key.toString()];
          }

          // fallback to returning undefined
        }

        return getItem(config, key.toString());
      },
      set(_target, key, value) {
        if (config.localFixture == null) {
          localStorage.setItem(key.toString(), JSON.stringify(value));
        }

        universe.local[key.toString()] = value;

        return true;
      },
    },
  ) as Partial<T>;
};

const prepareViewCtxFn = <T>(): PluginViewCtxFn<
  Config<T>,
  Universe<T>,
  ActionCtx<T>,
  ViewCtx<T>
> => ({ ctx }) => {
  ctx.local = createUniverseWatcher("local");
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
  plugin.prepareActionCtx(prepareActionCtxFn<T>());
  plugin.prepareViewCtx(prepareViewCtxFn<T>());

  return plugin;
};

export default localPlugin;
