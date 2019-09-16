import {
  Comp,
  createPlugin,
  PluginActionCtxFn,
  PluginInitFn,
  PluginViewCtx,
  PluginViewCtxFn,
  ProdoPlugin,
} from "@prodo/core";
import * as firebase from "firebase/app";
import "firebase/firestore";
import * as _ from "lodash";
import { createFirestoreQuery, createQueryName } from "./query";
import {
  ActionCtx,
  Collection,
  Config,
  DBQuery,
  Doc,
  DocChange,
  FetchAll,
  Fetching,
  Query,
  QueryRefs,
  Universe,
  ViewCtx,
} from "./types";

export { Collection };

(window as any).counter = 0;

let firestore: firebase.firestore.Firestore;

const initFn = <T>(): PluginInitFn<Config<T>, Universe> => (
  config,
  universe,
) => {
  if (!config.firestoreMock) {
    firebase.initializeApp(config.firebaseConfig);
    firestore = firebase.firestore();
  }

  universe.db_cache = {
    docs: {},
    queries: {},
  };
};

const cannotUseInAction = "Cannot use this method in an action";
const cannotUseInComponent = "Cannot use this method in a React component";

const addIdToDoc = <T>(
  doc: firebase.firestore.DocumentSnapshot,
): T & { id: string } => ({
  id: doc.id,
  ...(doc.data() as T),
});

const getSnapshotDocs = <T>(
  docs: firebase.firestore.QueryDocumentSnapshot[],
): Array<T & { id: string }> => docs.map(doc => addIdToDoc(doc));

const createActionCollection = <DB, T extends { id: string }>(
  _ctx: ActionCtx<DB>,
  collectionName: string,
): Collection<T> => {
  return {
    getAll: async (): Promise<T[]> => {
      const snapshot = await firestore.collection(collectionName).get();

      const data = getSnapshotDocs<T>(snapshot.docs);
      return data;
    },
    get: async (id: string): Promise<T> => {
      const doc = await firestore
        .collection(collectionName)
        .doc(id)
        .get();
      const data = addIdToDoc<T>(doc);

      return data;
    },
    set: async (id: string, value: Partial<T>): Promise<void> => {
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
    query: async (query: Query<T>): Promise<T[]> => {
      const ref = createFirestoreQuery(
        firestore.collection(collectionName),
        query,
      );
      const snapshot = await ref.get();

      const data = getSnapshotDocs<T>(snapshot.docs);
      return data;
    },
    insert: async (value: Pick<T, Exclude<keyof T, "id">>): Promise<string> => {
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

const updateDocs = <DB>(ctx: ActionCtx<DB>) => (
  collectionName: string,
  docChanges: DocChange[],
) => {
  docChanges.forEach(({ id, changeType, data }) => {
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
      _.set(ctx.db_cache.docs, path, {
        ...existingDoc,
        watchers: existingDoc.watchers - 1,
      });

      const doc = _.get(ctx.db_cache.docs, path);

      if (doc.watchers <= 0) {
        _.unset(ctx.db_cache.docs, path);
      }
    }
  });
};

const removeQuery = <DB>(ctx: ActionCtx<DB>) => (
  collectionName: string,
  queryName: string,
) => {
  const dbQuery = ctx.db_cache.queries[collectionName][queryName];
  delete ctx.db_cache.queries[collectionName][queryName];

  const docChanges: DocChange[] = dbQuery.ids.map(id => ({
    id,
    changeType: "removed",
  }));

  updateDocs(ctx)(collectionName, docChanges);
};

const updateQuery = <DB>(ctx: ActionCtx<DB>) => (
  collectionName: string,
  queryName: string,
  dbQuery: Partial<DBQuery>,
) => {
  const existingDbQuery: DBQuery = _.get(ctx.db_cache.queries, [
    collectionName,
    queryName,
  ]) || {
    // deafult db query
    ids: [],
    query: {},
    state: "fetching",
  };

  _.set(ctx.db_cache.queries, [collectionName, queryName], {
    ...existingDbQuery,
    ...dbQuery,
  });
};

// subscribe component to query and every id in the query
// when component is unsubscribed, cleanup queries and docs in universe
const subscribeComponent = <DB>({
  queryRefs,
  ctx,
  collectionName,
  queryName,
  comp,
  dbQuery,
}: {
  queryRefs: QueryRefs;
  ctx: ViewCtx<DB> & PluginViewCtx<ActionCtx<DB>, Universe>;
  collectionName: string;
  queryName: string;
  comp: Comp;
  dbQuery: DBQuery;
}) => {
  if (!queryRefs[queryName].watchers.has(comp.name)) {
    queryRefs[queryName].watchers.add(comp.name);
  }

  // subscribe component to query ids and each individual id
  ctx.subscribe(
    ["db_cache", "queries", collectionName, queryName, "ids"],
    (comp: Comp) => {
      if (queryRefs[queryName]) {
        queryRefs[queryName].watchers.delete(comp.name);

        if (queryRefs[queryName].watchers.size === 0) {
          ctx.dispatch(removeQuery)(collectionName, queryName);
          queryRefs[queryName].unsubscribe();
          delete queryRefs[queryName];
        }
      }
    },
  );

  if (dbQuery != null) {
    dbQuery.ids.forEach(id =>
      ctx.subscribe(["db_cache", "docs", collectionName, id]),
    );
  }
};

// try to get all docs for a query from the universe
const getDocsFromUniverse = <T>({
  dbQuery,
  universe,
  collectionName,
}: {
  dbQuery: DBQuery;
  universe: Universe;
  collectionName: string;
}): FetchAll<T> => {
  if (dbQuery == null || dbQuery.state === "fetching") {
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
    const data: T[] = dbQuery.ids
      .map(id => _.get(universe.db_cache.docs, [collectionName, id]))
      .filter(doc => doc != null)
      .map(doc => doc.data);

    return {
      _fetching: false,
      _notFound: false,
      data,
    };
  }
};

const createViewCollection = <DB, T extends { id: string }>(
  queryRefs: QueryRefs,
  ctx: ViewCtx<DB> & PluginViewCtx<ActionCtx<DB>, Universe>,
  collectionName: string,
  universe: Universe,
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
    watch: (id: string): Fetching<T> => {
      const queryName = `${collectionName}-${id}`;

      const dbQuery = _.get(universe.db_cache.queries, [
        collectionName,
        queryName,
      ]);

      const queryExists = dbQuery != null;

      // setup firestore watcher if it does not already exist
      if (!queryExists && !queryRefs[queryName]) {
        (window as any).counter += 1;

        let firstTime = true;

        const unsubscribe = firestore
          .collection(collectionName)
          .doc(id)
          .onSnapshot(
            snapshot => {
              const ids = [id];

              if (snapshot.exists) {
                const docChanges: DocChange[] = [
                  {
                    id,
                    data: addIdToDoc(snapshot),
                    changeType: firstTime ? "added" : "modified",
                  },
                ];

                firstTime = false;

                ctx.dispatch(updateDocs)(collectionName, docChanges);
                ctx.dispatch(updateQuery)(collectionName, queryName, {
                  ids,
                  state: "success",
                });
              } else {
                firstTime = true;

                // document does not exist
                const docChanges: DocChange[] = [
                  {
                    id,
                    data: addIdToDoc(snapshot),
                    changeType: "removed",
                  },
                ];

                ctx.dispatch(updateDocs)(collectionName, docChanges);
                ctx.dispatch(updateQuery)(collectionName, queryName, {
                  ids,
                  state: "error",
                });
              }
            },
            error => {
              // tslint:disable-next-line:no-console
              console.error("onSnapshot Error", error);
              ctx.dispatch(updateQuery)(collectionName, queryName, {
                state: "error",
              });
            },
          );

        ctx.dispatch(updateQuery)(collectionName, queryName, {
          state: "fetching",
        });

        queryRefs[queryName] = { unsubscribe, watchers: new Set() };
      }

      subscribeComponent({
        queryRefs,
        ctx,
        collectionName,
        queryName,
        comp,
        dbQuery,
      });

      // get all data for the query
      const data = getDocsFromUniverse<T>({
        dbQuery,
        universe,
        collectionName,
      });

      // convert array of data to single item, if it exists
      if (data._fetching) {
        return {
          _fetching: true,
        };
      }

      if (data._notFound) {
        return {
          _notFound: true,
        };
      }

      const element = data.data[0];
      return {
        _fetching: false,
        _notFound: false,
        data: element,
      };
    },
    watchAll: (query?: Query<T>): FetchAll<T> => {
      const queryName = createQueryName(collectionName, query);

      const dbQuery = _.get(universe.db_cache.queries, [
        collectionName,
        queryName,
      ]);

      const queryExists = dbQuery != null;

      // setup firestore watcher if it does not already exist
      if (!queryExists && !queryRefs[queryName]) {
        const ref = createFirestoreQuery(
          firestore.collection(collectionName),
          query,
        );

        (window as any).counter += 1;
        const unsubscribe = ref.onSnapshot(
          snapshot => {
            const ids = snapshot.docs.map(doc => doc.id);

            const docChanges: DocChange[] = snapshot
              .docChanges()
              .map(change => ({
                id: change.doc.id,
                changeType: change.type,
                data: addIdToDoc(change.doc),
              }));

            ctx.dispatch(updateDocs)(collectionName, docChanges);

            ctx.dispatch(updateQuery)(collectionName, queryName, {
              ids,
              state: "success",
            });
          },
          error => {
            // tslint:disable-next-line:no-console
            console.error("onSnapshot Error", error);
            ctx.dispatch(updateQuery)(collectionName, queryName, {
              state: "error",
            });
          },
        );

        ctx.dispatch(updateQuery)(collectionName, queryName, {
          state: "fetching",
        });

        queryRefs[queryName] = { unsubscribe, watchers: new Set() };
      }

      subscribeComponent({
        queryRefs,
        ctx,
        collectionName,
        queryName,
        comp,
        dbQuery,
      });

      const data = getDocsFromUniverse<T>({
        dbQuery,
        universe,
        collectionName,
      });
      return data;
    },
    ref: (): firebase.firestore.CollectionReference => {
      return firestore.collection(name);
    },
  };
};

const prepareViewCtx = <DB>(
  queryRefs: QueryRefs,
): PluginViewCtxFn<Config<DB>, Universe, ActionCtx<DB>, ViewCtx<DB>> => ({
  ctx,
  universe,
  comp,
}) => {
  ctx.db = new Proxy(
    {},
    {
      get(_target, key) {
        return createViewCollection(
          queryRefs,
          ctx,
          key.toString(),
          universe,
          comp,
        );
      },
    },
  ) as DB;
};

const prepareActionCtx = <DB>(): PluginActionCtxFn<
  Config<DB>,
  Universe,
  ActionCtx<DB>
> => ({ ctx, universe }) => {
  ctx.db_cache = universe.db_cache;

  ctx.db = new Proxy(
    {},
    {
      get(_target, key) {
        return createActionCollection(ctx, key.toString());
      },
    },
  ) as DB;
};

const firestorePlugin = <DB>(): ProdoPlugin<
  Config<DB>,
  Universe,
  ActionCtx<DB>,
  ViewCtx<DB>
> => {
  const plugin = createPlugin<Config<DB>, Universe, ActionCtx<DB>, ViewCtx<DB>>(
    "firestore",
  );

  const queryRefs: QueryRefs = {};

  plugin.init(initFn<DB>());
  plugin.prepareActionCtx(prepareActionCtx<DB>());
  plugin.prepareViewCtx(prepareViewCtx<DB>(queryRefs));

  return plugin;
};

export default firestorePlugin;
