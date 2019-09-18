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

  const prodoKey = serializeKey(key);
  const localItem = localStorage.getItem(prodoKey);
  if (localItem != null) {
    return parseItem(prodoKey, localItem);
  }

  return undefined;
};

const keyExists = <T>(config: Config<T>, key: string): boolean => {
  if (config.localFixture) {
    return Object.keys(config.localFixture).includes(key);
  }

  return Object.keys(localStorage).includes(serializeKey(key));
};

const init = <T>(config: Config<T>, universe: Universe<T>) => {
  universe.local = {};

  // init universe with values from localStorage or fixtures
  const keys =
    config.localFixture == null
      ? Object.keys(localStorage).filter(isProdoKey)
      : Object.keys(config.localFixture);

  universe.local = keys.reduce((acc, key) => {
    const item =
      config.localFixture == null
        ? localStorage.getItem(key)
        : JSON.stringify(config.localFixture[key]);

    if (item == null) {
      return acc;
    }

    return {
      ...acc,
      [config.localFixture == null ? deserializeKey(key) : key]: parseItem(
        key,
        item,
      ),
    };
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
          localStorage.setItem(
            serializeKey(key.toString()),
            JSON.stringify(value),
          );
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
