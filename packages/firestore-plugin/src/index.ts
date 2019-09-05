import { Comp, ProdoPlugin } from "@prodo/core";
import * as firebase from "firebase/app";
import "firebase/firestore";
import * as _ from "lodash";
import { createFirestoreQuery } from "./query";
import {
  Collection,
  FetchAll,
  FetchData,
  FirestoreActionCtx,
  FirestoreConfig,
  FirestoreUniverse,
  FirestoreViewCtx,
  Query,
  RefCounts,
  WithId,
} from "./types";

export { Collection };

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

const addIdToDoc = <T>(
  doc: firebase.firestore.QueryDocumentSnapshot,
): WithId<T> => ({
  id: doc.id,
  ...(doc.data() as T),
});

const getSnapshotDocs = <T>(
  docs: firebase.firestore.QueryDocumentSnapshot[],
): Array<WithId<T>> => docs.map(doc => addIdToDoc(doc));

const getDocsById = <T>(
  docs: firebase.firestore.QueryDocumentSnapshot[],
): { [key: string]: WithId<T> } =>
  _.transform(
    getSnapshotDocs<T>(docs),
    (byId: { [key: string]: WithId<T> }, doc) => {
      byId[doc.id] = doc;
    },
    {},
  );

const createActionCollection = <T>(
  ctx: FirestoreActionCtx<T>,
  collectionName: string,
): Collection<T> => {
  return {
    getAll: async (): Promise<Array<WithId<T>>> => {
      const snapshot = await firestore.collection(collectionName).get();

      const data = getDocsById<T>(snapshot.docs);
      ctx.dispatch(saveDataToCache)([collectionName], data);

      return Object.values(data);
    },
    get: async (id: string): Promise<WithId<T>> => {
      const doc = await firestore
        .collection(collectionName)
        .doc(id)
        .get();
      const data = addIdToDoc<T>(doc);

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
    query: async (query: Query): Promise<Array<WithId<T>>> => {
      const ref = createFirestoreQuery(
        query,
        firestore.collection(collectionName),
      );
      const snapshot = await ref.get();
      const data = getDocsById<T>(snapshot.docs);

      ctx.dispatch(saveDataToCache)([collectionName], data);

      return Object.values(data);
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
    ref: (): firebase.firestore.CollectionReference => {
      return firestore.collection(name);
    },
  };
};

const subscribeToPath = <T>(
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
    query: () => {
      throw new Error(cannotUseInComponent);
    },
    watch: (id: string): FetchData<WithId<T>> => {
      const path = ["db_cache", name, id];
      const pathKey = path.join(".");

      if (!universe.db_cache[collectionName] || !refCounts[pathKey]) {
        const unsubscribe = firestore
          .collection(collectionName)
          .doc(id)
          .onSnapshot(doc => {
            const data = addIdToDoc<T>(doc);

            ctx.dispatch(saveDataToCache)([collectionName, id], data);
          });

        if (!refCounts[pathKey]) {
          refCounts[pathKey] = {
            comps: new Set(),
            unsubscribe,
          };
        }
      }

      subscribeToPath(refCounts, ctx, path, comp);

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
            const docs = getDocsById(snapshot.docs);
            ctx.dispatch(saveDataToCache)([collectionName], docs);
          });

        if (!refCounts[pathKey]) {
          refCounts[pathKey] = {
            comps: new Set(),
            unsubscribe,
          };
        }
      }

      subscribeToPath(refCounts, ctx, path, comp);

      if (!universe.db_cache[collectionName]) {
        return {
          _fetching: true,
        };
      } else {
        const flatData = Object.values(
          universe.db_cache[collectionName],
        ) as Array<WithId<T>>;

        return {
          _fetching: false,
          _notFound: false,
          data: flatData,
        };
      }
    },
    ref: (): firebase.firestore.CollectionReference => {
      return firestore.collection(name);
    },
  };
};

const prepareViewCtx = <T>(refCounts: RefCounts) => ({
  ctx,
  universe,
  comp,
}: {
  ctx: FirestoreViewCtx<T>;
  universe: FirestoreUniverse;
  comp: Comp;
}) => {
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

const prepareActionCtx = <T>({
  ctx,
  universe,
}: {
  ctx: FirestoreActionCtx<T>;
  universe: FirestoreUniverse;
}) => {
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
  FirestoreActionCtx<T>,
  FirestoreViewCtx<T>
> => ({
  name: "firestore",
  init,
  prepareActionCtx,
  prepareViewCtx: prepareViewCtx({}),
});

export default firestorePlugin;
