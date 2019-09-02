import { ProdoPlugin } from "@prodo/core";

export interface LocalConfig<T> {
  initLocal?: T;
  mockLocal?: boolean;
}

export interface Local<T> {
  local: T;
}

const localKey = "prodo-local-storage";
const init = <T>(config: LocalConfig<T>, universe: Local<T>) => {
  if (config.mockLocal) {
    if (!config.initLocal) {
      throw new Error(
        "[local plugin]: Need to provide initLocal when mock is true.",
      );
    }

    universe.local = config.initLocal;
  } else {
    const item = localStorage.getItem(localKey);
    if (config.initLocal && item == null) {
      localStorage.setItem(localKey, JSON.stringify(config.initLocal));
      universe.local = config.initLocal;
    }
  }
};

const prepareActionCtx = <T>(
  ctx: Local<T>,
  config: LocalConfig<T>,
  universe: Local<T>,
  _event: any,
) => {
  let item: T;
  try {
    item = config.mockLocal
      ? universe.local
      : JSON.parse(localStorage.getItem(localKey));
  } catch (e) {
    if (!config.initLocal) {
      throw e;
    }
    item = config.initLocal;
  }

  universe.local = item;

  const createLocalProxy = (target: any) =>
    new Proxy(target, {
      get(target, key) {
        if (target[key] && typeof target[key] === "object") {
          return createLocalProxy(target[key]);
        }

        return target[key];
      },
      set(target, key, value) {
        target[key] = value;

        if (!config.mockLocal) {
          localStorage.setItem(localKey, JSON.stringify(universe.local));
        }
        return true;
      },
    });

  ctx.local = createLocalProxy(item);
};

const prepareViewCtx = <T>(
  ctx: Local<T>,
  config: LocalConfig<T>,
  universe: Local<T>,
) => {
  let item: T;
  try {
    item = config.mockLocal
      ? universe.local
      : JSON.parse(localStorage.getItem(localKey));
  } catch (e) {
    if (!config.initLocal) {
      throw e;
    }
    item = config.initLocal;
  }

  ctx.local = item;
};

const localPlugin = <T>(): ProdoPlugin<
  LocalConfig<T>,
  Local<T>,
  Local<T>,
  Local<T>
> => ({
  init,
  prepareActionCtx,
  prepareViewCtx,
});

export default localPlugin;
