import { Comp, ProdoPlugin, PluginViewCtx, PluginActionCtx } from "@prodo/core";
import * as _ from "lodash";
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

type WithId<T> = T & { id: string };

type FetchData<T> =
  | { _fetching: true; _notFound?: never; data?: T }
  | { _notFound: true; _fetching?: never; data?: T }
  | { _fetching?: false; _notFound?: false; data: T };

export type Fetching<T> = FetchData<WithId<T>>;
export type FetchAll<T> = FetchData<WithId<T>[]>;
export type Collection<T> = {
  // methods used in actions only (no risk for people to get confused and use those in react components since react components can't be async)

  get: (id: string) => Promise<WithId<T>>;
  getAll: () => Promise<WithId<T>[]>;
  set: (id: string, value: T) => Promise<void>;
  delete: (id: string) => Promise<void>;
  insert: (value: T) => Promise<string>;
  // query: (filter: Query<T>) => T[];

  // methods used in React components (or inside some actions, although less likely)

  // fetch: (key: string) => Fetching<T>;
  // fetchAll: () => FetchAll<T[]>;
  watch: (id: string) => Fetching<WithId<T>>;
  watchAll: () => FetchAll<WithId<T>>;

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
  pathKey: string[],
  value: any,
) => {
  _.set(db_cache, pathKey, value);
};

const cannotUseInAction = "Cannot use this method in an action";
const cannotUseInComponent = "Cannot use this method in a React component";

const createActionCollection = <T>(
  ctx: FirestoreActionCtx<T>,
  collectionName: string,
): Collection<T> => {
  return {
    getAll: async (): Promise<WithId<T>[]> => {
      const snapshot = await firestore.collection(collectionName).get();
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as T),
      }));

      ctx.dispatch(saveDataToCache)([collectionName], data);

      return data;
    },
    get: async (id: string): Promise<WithId<T>> => {
      const snapshot = await firestore
        .collection(collectionName)
        .doc(id)
        .get();
      const data = {
        id: snapshot.id,
        ...(snapshot.data() as T),
      };

      ctx.dispatch(saveDataToCache)([collectionName, id], data);

      return data;
    },
    set: async (id: string, value: T): Promise<void> => {
      await firestore
        .collection(collectionName)
        .doc(id)
        .set(value);
    },
    delete: async (id: string): Promise<void> => {
      await firestore
        .collection(collectionName)
        .doc(id)
        .delete();
    },
    insert: async (value: T): Promise<string> => {
      const ref = await firestore.collection(collectionName).add(value);
      return ref.id;
    },
    watch: () => {
      throw new Error(cannotUseInAction);
    },
    watchAll: () => {
      throw new Error(cannotUseInAction);
    },
  };
};

const checkRefCounts = <T>(
  refCounts: RefCounts,
  ctx: FirestoreViewCtx<T>,
  path: string[],
  comp: Comp,
) => {
  const pathKey = path.join(".");
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
};

const createViewCollection = <T>(
  refCounts: RefCounts,
  ctx: FirestoreViewCtx<T>,
  collectionName: string,
  universe: FirestoreUniverse,
  comp: Comp,
): Collection<T> => {
  return {
    get: () => {
      throw new Error(cannotUseInComponent);
    },
    getAll: async () => {
      throw new Error(cannotUseInComponent);
    },
    insert: () => {
      throw new Error(cannotUseInComponent);
    },
    set: () => {
      throw new Error(cannotUseInComponent);
    },
    delete: () => {
      throw new Error(cannotUseInComponent);
    },
    watch: (id: string): FetchData<WithId<T>> => {
      const path = ["db_cache", name, id];
      const pathKey = path.join(".");

      if (!universe.db_cache[collectionName] || !refCounts[pathKey]) {
        const unsubscribe = firestore
          .collection(collectionName)
          .doc(id)
          .onSnapshot(snapshot => {
            const data = {
              id: snapshot.id,
              ...(snapshot.data() as T),
            };

            ctx.dispatch(saveDataToCache)([collectionName, id], data);
          });

        refCounts[pathKey] = {
          comps: new Set(),
          unsubscribe,
        };
      }

      checkRefCounts(refCounts, ctx, path, comp);

      if (!universe.db_cache[collectionName]) {
        return {
          _fetching: true,
        };
      } else {
        const data = _.get(universe.db_cache, path) as WithId<T>;
        return {
          _fetching: false,
          _notFound: false,
          data,
        };
      }
    },
    watchAll: (): FetchAll<T> => {
      const path = ["db_cache", collectionName];
      const pathKey = path.join(".");

      if (!universe.db_cache[collectionName] || !refCounts[pathKey]) {
        const unsubscribe = firestore
          .collection(collectionName)
          .onSnapshot(snapshot => {
            const byId = _.transform(
              snapshot.docs,
              (byId: { [key: string]: WithId<T> }, doc) => {
                byId[doc.id] = {
                  id: doc.id,
                  ...(doc.data() as T),
                };
              },
              {},
            );

            ctx.dispatch(saveDataToCache)([collectionName], byId);
          });

        refCounts[pathKey] = {
          comps: new Set(),
          unsubscribe,
        };
      }

      checkRefCounts(refCounts, ctx, path, comp);

      if (!universe.db_cache[collectionName]) {
        return {
          _fetching: true,
        };
      } else {
        const flatData = Object.values(
          universe.db_cache[collectionName],
        ) as WithId<T>[];

        return {
          _fetching: false,
          _notFound: false,
          data: flatData,
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
