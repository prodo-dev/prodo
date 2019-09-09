import { Comp, ProdoPlugin } from "@prodo/core";
import * as firebase from "firebase/app";
import "firebase/firestore";
import * as _ from "lodash";
import { createFirestoreQuery, createQueryName } from "./query";
import {
  Collection,
  FetchAll,
  Unsubs,
  Doc,
  ActionCtx,
  DBQuery,
  Config,
  Universe,
  ViewCtx,
  Query,
  WithId,
  DocsCollection,
} from "./types";

export { Collection };

let firestore: firebase.firestore.Firestore;

const init = <T>(config: Config<T>, universe: Universe) => {
  if (!config.firestoreMock) {
    firebase.initializeApp(config.firebaseConfig);
    firestore = firebase.firestore();
  }

  universe.db_cache = {
    docs: {},
    queries: {},
  };
};

export const saveData = <T>(_ctx: ActionCtx<T>) => (
  collectionName: string,
  docs: DocsCollection,
) => {
  console.log("saving data to", collectionName);
  console.log(docs);
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
  _ctx: ActionCtx<T>,
  collectionName: string,
): Collection<T> => {
  return {
    getAll: async (): Promise<Array<WithId<T>>> => {
      const snapshot = await firestore.collection(collectionName).get();

      const data = getDocsById<T>(snapshot.docs);

      return Object.values(data);
    },
    get: async (id: string): Promise<WithId<T>> => {
      const doc = await firestore
        .collection(collectionName)
        .doc(id)
        .get();
      const data = addIdToDoc<T>(doc);

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
        firestore.collection(collectionName),
        query,
      );
      const snapshot = await ref.get();
      const data = getDocsById<T>(snapshot.docs);

      return Object.values(data);
    },
    insert: async (value: T): Promise<string> => {
      const ref = await firestore.collection(collectionName).add(value);
      return ref.id;
    },
    watchAll: () => {
      throw new Error(cannotUseInAction);
    },
    ref: (): firebase.firestore.CollectionReference => {
      return firestore.collection(name);
    },
  };
};

const updateDoc = <T>(ctx: ActionCtx<T>) => (
  collectionName: string,
  changeType: "added" | "modified" | "removed",
  id: string,
  data?: any,
) => {
  const path = [collectionName, id];
  const existingDoc: Doc = _.get(ctx.db_cache.docs, path) || {
    // default,
    watchers: 0,
  };

  if (changeType === "added") {
    _.set(ctx.db_cache.docs, path, {
      ...existingDoc,
      watchers: existingDoc.watchers + 1,
      data,
    });
  } else if (changeType === "modified") {
    _.set(ctx.db_cache.docs, path, {
      ...existingDoc,
      data,
    });
  } else if (changeType === "removed") {
    _.set(ctx.db_cache, path, {
      ...existingDoc,
      watchers: existingDoc.watchers - 1,
    });
  }
};

const updateQuery = <T>(ctx: ActionCtx<T>) => (
  collectionName: string,
  queryName: string,
  dbQuery: Partial<DBQuery>,
) => {
  const existingDbQuery = _.get(ctx.db_cache.queries, [
    collectionName,
    queryName,
  ]) || {
    // deafult db query
    ids: [],
    query: {},
    state: "fetching",
    watchers: [],
  };

  _.set(ctx.db_cache, [collectionName, queryName], {
    ...existingDbQuery,
    dbQuery,
  });
};

const createViewCollection = <T>(
  unsubs: Unsubs,
  ctx: ViewCtx<T>,
  collectionName: string,
  universe: Universe,
  _comp: Comp,
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
    watchAll: (query?: Query): FetchAll<T> => {
      const queryName = createQueryName(collectionName, query);

      const dbQuery = _.get(universe.db_cache.queries, [
        collectionName,
        queryName,
      ]);
      const queryExists = dbQuery != null;

      // setup firestore watcher if it does not already exist
      if (!queryExists) {
        const ref = createFirestoreQuery(
          firestore.collection(collectionName),
          query,
        );

        const unsubscribe = ref.onSnapshot(
          snapshot => {
            const ids = snapshot.docs.map(doc => doc.id);
            // const docs = getDocsById(snapshot.docs);

            snapshot.docChanges().forEach(change => {
              ctx.dispatch(updateDoc)(
                collectionName,
                change.type,
                change.doc.id,
                change.doc.data(),
              );
            });

            ctx.dispatch(updateQuery)(collectionName, queryName, {
              ids,
              state: "success",
            });
          },
          error => {
            console.error("onSnapshot Error", error);
            ctx.dispatch(updateQuery)(collectionName, queryName, {
              state: "error",
            });
          },
        );

        ctx.dispatch(updateQuery)(collectionName, queryName, {
          state: "fetching",
        });

        unsubs[queryName] = unsubscribe;
      }

      // subscribe component to query ids and each individual id
      ctx.subscribe(["db_cache", "queries", collectionName, queryName, "ids"]);
      if (queryExists) {
        dbQuery.ids.forEach(id =>
          ctx.subscribe(["db_cache", "docs", collectionName, id]),
        );
      }

      // return data if it exists
      if (!queryExists) {
        return {
          _fetching: true,
        };
      } else {
        // query error
        if (dbQuery.state === "error") {
          return {
            _notFound: true,
          };
        }

        // get all docs from docs cache
        const data: Array<WithId<T>> = dbQuery.ids.map(
          id => _.get(universe.db_cache.docs, [collectionName, id]).data,
        );

        return {
          _fetching: false,
          _notFound: false,
          data,
        };
      }

      // if (!universe.db_cache[collectionName] || !refCounts[pathKey]) {
      //   const unsubscribe = firestore
      //     .collection(collectionName)
      //     .onSnapshot(snapshot => {
      //       const docs = getDocsById(snapshot.docs);
      //       ctx.dispatch(saveDataToCache)([collectionName], docs);
      //     });

      //   if (!refCounts[pathKey]) {
      //     refCounts[pathKey] = {
      //       comps: new Set(),
      //       unsubscribe,
      //     };
      //   }
      // }

      // subscribeToPath(refCounts, ctx, path, comp);

      // if (!universe.db_cache[collectionName]) {
      //   return {
      //     _fetching: true,
      //   };
      // } else {
      //   const flatData = Object.values(
      //     universe.db_cache[collectionName],
      //   ) as Array<WithId<T>>;

      //   return {
      //     _fetching: false,
      //     _notFound: false,
      //     data: flatData,
      //   };
      // }
    },
    ref: (): firebase.firestore.CollectionReference => {
      return firestore.collection(name);
    },
  };
};

const prepareViewCtx = <T>(unsubs: Unsubs) => ({
  ctx,
  universe,
  comp,
}: {
  ctx: ViewCtx<T>;
  universe: Universe;
  comp: Comp;
}) => {
  ctx.db = new Proxy(
    {},
    {
      get(_target, key) {
        return createViewCollection(
          unsubs,
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
  ctx: ActionCtx<T>;
  universe: Universe;
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
  Config<T>,
  Universe,
  ActionCtx<T>,
  ViewCtx<T>
> => ({
  name: "firestore",
  init,
  prepareActionCtx,
  prepareViewCtx: prepareViewCtx({}),
});

export default firestorePlugin;
