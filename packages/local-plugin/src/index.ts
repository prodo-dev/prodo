import { createUniverseWatcher, ProdoPlugin } from "@prodo/core";

export interface Local<T> {
  local: Partial<T>;
}

export interface Config<T> {
  mockLocal?: boolean;
  initLocal?: T;
}
export type Universe<T> = Local<T>;
export type ActionCtx<T> = Local<T>;
export type ViewCtx<T> = Local<T>;

const init = <T>(config: Config<T>, universe: Universe<T>) => {
  if (config.mockLocal && !config.initLocal) {
    throw new Error("initLocal is required if you are mocking local storage");
  }

  universe.local = {};
  if (!config.mockLocal) {
    universe.local = Object.keys(localStorage).reduce(
      (acc, key) => ({ ...acc, [key]: JSON.parse(localStorage.getItem(key)) }),
      {},
    );
  }

  if (config.initLocal) {
    Object.keys(config.initLocal).forEach(key => {
      if (!universe.local[key]) {
        universe.local[key] = config.initLocal[key];
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
        if (config.mockLocal) {
          return config.initLocal[key.toString()];
        }

        const item = localStorage.getItem[key.toString()];
        return JSON.parse(item);
      },
      set(_target, key, value) {
        if (!config.mockLocal) {
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
