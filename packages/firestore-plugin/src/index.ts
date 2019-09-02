import { ProdoPlugin, PluginViewCtx, PluginActionCtx } from "@prodo/core";
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
  console.log(config);
  if (!config.firestoreMock) {
    firebase.initializeApp(config.firebaseConfig);
    console.log(firebase);
    firestore = firebase.firestore();
    console.log("created firestore");
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
  ctx: FirestoreViewCtx<T>,
  name: string,
  universe: FirestoreUniverse,
): Collection<T> => {
  return {
    getAll: async () => {
      throw new Error("Cannot use this method in a React component");
    },
    insert: () => {
      throw new Error("Cannot use this method in a React component");
    },
    watchAll: (): FetchAll<T> => {
      ctx.subscribe(["db_cache", name]);

      if (!universe.db_cache[name]) {
        firestore.collection(name).onSnapshot(snapshot => {
          const data = snapshot.docs.map(doc => doc.data() as T);

          console.log(snapshot);

          ctx.dispatch(saveDataToCache)(name, data);
        });

        universe.db_cache[name] = {
          _fetching: true,
        };

        return universe.db_cache[name];
      }

      return {
        _fetching: false,
        _notFound: false,
        data: universe.db_cache[name],
      };
    },
  };
};

const prepareViewCtx = <T>(
  ctx: FirestoreViewCtx<T>,
  _config: FirestoreConfig<T>,
  universe: FirestoreUniverse,
) => {
  console.log("UNIVERSE", universe);
  ctx.db = new Proxy(
    {},
    {
      get(_target, key) {
        return createViewCollection(ctx, key.toString(), universe);
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

// const hydrate = <Schema, T>(schema: Schema, data: T): T => {
//   for (const [key, subSchema] of Object.entries(schema)) {
//     if (subSchema._collection) {
//       data[key] = createCollection(key, subSchema);
//     }
//   }
//   return data;
// };

const firestorePlugin = <T>(): ProdoPlugin<
  FirestoreConfig<T>,
  FirestoreUniverse,
  FirestoreCtx<T>,
  FirestoreCtx<T>
> => ({
  init,
  prepareActionCtx,
  prepareViewCtx,
});

export default firestorePlugin;
