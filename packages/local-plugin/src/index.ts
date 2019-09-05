import { createUniverseWatcher, ProdoPlugin } from "@prodo/core";

export interface Local<T> {
  local: Partial<T>;
}

export interface Config<T> {
  initLocal?: T;
}
export type Universe<T> = Local<T>;
export type ActionCtx<T> = Local<T>;
export type ViewCtx<T> = Local<T>;

const init = <T>(config: Config<T>, universe: Universe<T>) => {
  universe.local = Object.keys(localStorage).reduce(
    (acc, key) => ({ ...acc, [key]: JSON.parse(localStorage.getItem(key)) }),
    {},
  );

  if (config.initLocal) {
    Object.keys(config.initLocal).forEach(key => {
      if (!universe.local[key]) {
        universe.local[key] = config.initLocal[key];
      }
    });
  }
};

const readLocalStorage = (key: string): any => {
  const item = localStorage.getItem[key];
  return JSON.parse(item);
};

const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const prepareActionCtx = <T>({
  ctx,
  universe,
}: {
  ctx: ActionCtx<T>;
  universe: Universe<T>;
}) => {
  ctx.local = new Proxy(
    {},
    {
      get(_target, key) {
        return readLocalStorage(key.toString());
      },
      set(_target, key, value) {
        setLocalStorage(key.toString(), value);
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
