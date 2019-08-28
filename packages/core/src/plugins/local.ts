import { ProdoPlugin } from "../types";

export interface Local<T> {
  local: T;
}

export interface LocalConfig<T> {
  initLocal: T;
}

const localKey = "prodo-local-storage";
const init = <T>(config: LocalConfig<T>, universe: Local<T>) => {
  const item = localStorage.getItem(localKey);
  if (config.initLocal && item == null) {
    console.log("initing local storage with config");
    localStorage.setItem(localKey, JSON.stringify(config.initLocal));
    universe.local = config.initLocal;
  } else {
    console.log("found existing localstorage");
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
    item = JSON.parse(localStorage.getItem(localKey));
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
          console.log(`getting proxied ${String(key)} on `, target);
          return createLocalProxy(target[key]);
        }

        console.log(`getting primitaive ${String(key)} on `, target);
        return target[key];
      },
      set(target, key, value) {
        console.log(`setting ${String(key)} on`, target);
        target[key] = value;

        localStorage.setItem(localKey, JSON.stringify(universe.local));
        return true;
      },
    });

  ctx.local = createLocalProxy(item);
};

const prepareViewCtx = <T>(config: LocalConfig<T>, universe: Local<T>) => {
  let item: T;
  try {
    item = JSON.parse(localStorage.getItem(localKey));
  } catch (e) {
    if (!config.initLocal) {
      throw e;
    }
    item = config.initLocal;
  }

  universe.local = item;
};

const localPlugin = <T>(): ProdoPlugin<
  LocalConfig<T>,
  {},
  Local<T>,
  Local<T>
> => ({
  init,
  prepareActionCtx,
  prepareViewCtx,
});

export default localPlugin;
