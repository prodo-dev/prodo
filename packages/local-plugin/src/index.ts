import { createUniverseWatcher, ProdoPlugin } from "@prodo/core";

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

const init = <T>(config: Config<T>, universe: Universe<T>) => {
  universe.local = {};

  // no fixture was provided, load all values from local storage into universe
  if (config.localFixture == null) {
    universe.local = Object.keys(localStorage).reduce((acc, key) => {
      const item = localStorage.getItem(key);
      if (item == null) {
        return acc;
      }

      return { ...acc, [key]: parseItem(key, item) };
    }, {});
  }

  // use initLocal for any values that have not yet been loaded
  if (config.initLocal != null) {
    Object.keys(config.initLocal).forEach(key => {
      if (!universe.local[key]) {
        universe.local[key] = config.initLocal![key];
      }
    });
  }
};

const prepareActionCtx = <T>(
  {
    ctx,
    universe,
  }: {
    ctx: ActionCtx<T>;
    universe: Universe<T>;
  },
  config: Config<T>,
) => {
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

const prepareViewCtx = <T>({ ctx }: { ctx: ViewCtx<T> }) => {
  ctx.local = createUniverseWatcher("local");
};

const localPlugin = <T>(): ProdoPlugin<
  Config<T>,
  Universe<T>,
  ActionCtx<T>,
  ViewCtx<T>
> => ({
  name: "local",
  init,
  prepareActionCtx,
  prepareViewCtx,
});

export default localPlugin;
