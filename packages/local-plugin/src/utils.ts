const TEST_KEY = "__storage_test__";

export const isLocalStorageAvailable = () => {
  try {
    if (typeof window !== "object" || window.localStorage == null) {
      return false;
    }
    window.localStorage.setItem(TEST_KEY, TEST_KEY);
    window.localStorage.removeItem(TEST_KEY);
    return true;
  } catch (e) {
    return false;
  }
};

export const createInMemoryLocalStorage = () => {
  const store = {};
  return new Proxy(
    {
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      getItem: (key: string) => store[key],
    },
    {
      ownKeys: () => Reflect.ownKeys(store),
      has: (_, key) => key in store,
      getOwnPropertyDescriptor: () => ({
        enumerable: true,
        configurable: true,
      }),
    },
  );
};

const prefix = "prodo:";

export const isProdoKey = (key: string) => key.startsWith(prefix);
export const serializeKey = (key: string) => `${prefix}${key}`;
export const deserializeKey = (key: string) => {
  if (!isProdoKey(key)) {
    throw new Error(`${key.toString()} is not handled by prodo.`);
  }
  return key.slice(prefix.length);
};
