import { Comp, ProdoPlugin, PluginViewCtx, PluginActionCtx } from "@prodo/core";
import * as firebase from "firebase/app";
import "firebase/firestore";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface FirestoreConfig<T> {
  firestoreMock?: T;
  firebaseConfig: FirebaseConfig;
}

export interface FirestoreCtx<T> {
  db: T;
}

export interface FirestoreActionCtx<T>
  extends FirestoreCtx<T>,
    PluginActionCtx<FirestoreActionCtx<T>> {
  db_cache: any;
}

export interface FirestoreViewCtx<T>
  extends FirestoreCtx<T>,
    PluginViewCtx<FirestoreActionCtx<T>> {}

export interface FirestoreUniverse {
  db_cache: any;
}

export interface RefCounts {
  [key: string]: {
    comps: Set<Comp>;
    unsubscribe: () => void;
  };
}

type FetchData<T> =
  | { _fetching: true; _notFound?: never; data?: T }
  | { _notFound: true; _fetching?: never; data?: T }
  | { _fetching?: false; _notFound?: false; data: T };

export type Fetching<T> = FetchData<T>;
export type FetchAll<T> = FetchData<T[]>;
export type Collection<T> = {
  // methods used in actions only (no risk for people to get confused and use those in react components since react components can't be async)
  // get: (key: string) => Promise<T>;
  getAll: () => Promise<T[]>;
  // set: (key: string, value: T) => Promise<void>;
  // delete: (key: string) => Promise<void>;
  insert: (value: T) => Promise<string>;
  // query: (filter: Query<T>) => T[];
  // methods used in React components (or inside some actions, although less likely)
  // fetch: (key: string) => Fetching<T>;
  // fetchAll: () => FetchAll<T[]>;
  // watch: (key: string) => Fetching<T>;
  watchAll: () => FetchAll<T>;
  // used in either case for subcollections:
  // ref: (key: string) => T;
};

let firestore: firebase.firestore.Firestore;

const init = <T>(config: FirestoreConfig<T>, universe: FirestoreUniverse) => {
  if (!config.firestoreMock) {
    firebase.initializeApp(config.firebaseConfig);
    firestore = firebase.firestore();
  }

  universe.db_cache = {};
};

const saveDataToCache = <T>({ db_cache }: FirestoreActionCtx<T>) => (
  key: string,
  value: any,
) => {
  db_cache[key] = value;
};

const createActionCollection = <T>(
  ctx: FirestoreActionCtx<T>,
  name: string,
): Collection<T> => {
  return {
    getAll: async (): Promise<T[]> => {
      const snapshot = await firestore.collection(name).get();
      const data = snapshot.docs.map(doc => doc.data() as T);

      ctx.dispatch(saveDataToCache)(name, data);

      return;
    },
    insert: async (value: T): Promise<string> => {
      const ref = await firestore.collection(name).add(value);
      return ref.id;
    },
    watchAll: () => {
      throw new Error("Cannot use this method in an action");
    },
  };
};

const createViewCollection = <T>(
  refCounts: RefCounts,
  ctx: FirestoreViewCtx<T>,
  name: string,
  universe: FirestoreUniverse,
  comp: Comp,
): Collection<T> => {
  return {
    getAll: async () => {
      throw new Error("Cannot use this method in a React component");
    },
    insert: () => {
      throw new Error("Cannot use this method in a React component");
    },
    watchAll: (): FetchAll<T> => {
      const path = ["db_cache", name];
      const pathKey = path.join(".");

      if (!universe.db_cache[name] || !refCounts[pathKey]) {
        const unsubscribe = firestore.collection(name).onSnapshot(snapshot => {
          const data = snapshot.docs.map(doc => {
            return doc.data() as T;
          });

          ctx.dispatch(saveDataToCache)(name, data);
        });

        refCounts[pathKey] = {
          comps: new Set(),
          unsubscribe,
        };
      }

      if (!refCounts[pathKey].comps.has(comp)) {
        refCounts[pathKey].comps.add(comp);
        ctx.subscribe(path, () => {
          refCounts[pathKey].comps.delete(comp);

          if (refCounts[pathKey].comps.size === 0) {
            refCounts[pathKey].unsubscribe();
            delete refCounts[pathKey];
          }
        });
      }

      if (!universe.db_cache[name]) {
        return {
          _fetching: true,
        };
      } else {
        return {
          _fetching: false,
          _notFound: false,
          data: universe.db_cache[name],
        };
      }
    },
  };
};

const prepareViewCtx = <T>(refCounts: RefCounts) => (
  ctx: FirestoreViewCtx<T>,
  _config: FirestoreConfig<T>,
  universe: FirestoreUniverse,
  comp: Comp,
) => {
  ctx.db = new Proxy(
    {},
    {
      get(_target, key) {
        return createViewCollection(
          refCounts,
          ctx,
          key.toString(),
          universe,
          comp,
        );
      },
    },
  ) as T;
};

const prepareActionCtx = <T>(
  ctx: FirestoreActionCtx<T>,
  _config: FirestoreConfig<T>,
  universe: FirestoreUniverse,
) => {
  ctx.db_cache = universe.db_cache;

  ctx.db = new Proxy(
    {},
    {
      get(_target, key) {
        return createActionCollection(ctx, key.toString());
      },
    },
  ) as T;
};

const firestorePlugin = <T>(): ProdoPlugin<
  FirestoreConfig<T>,
  FirestoreUniverse,
  FirestoreCtx<T>,
  FirestoreCtx<T>
> => ({
  init,
  prepareActionCtx,
  prepareViewCtx: prepareViewCtx({}),
});

export default firestorePlugin;
