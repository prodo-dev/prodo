import { Comp, PluginActionCtx, PluginViewCtx } from "@prodo/core";
import * as firebase from "firebase/app";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface DBCache {
  docs: {
    [collectionName: string]: DocsCollection;
  };
  queries: {
    [collectionName: string]: {
      [queryName: string]: DBQuery;
    };
  };
}

export interface DocsCollection {
  [id: string]: Doc;
}

export interface Doc {
  data: any;
  watchers: number;
}

export interface DocChange {
  id: string;
  changeType: "added" | "modified" | "removed";
  data?: any;
}

export interface DBQuery {
  ids: string[];
  watchers: string[];
  query: any;
  state: "success" | "fetching" | "error";
}

export interface Config<T> {
  firestoreMock?: T;
  firebaseConfig: FirebaseConfig;
}

export interface QueryRefs {
  [queryName: string]: {
    unsubscribe: () => void;
    watchers: Set<string>;
  };
}

export interface Ctx<T> {
  db: T;
}

export interface ActionCtx<T>
  extends Ctx<T>,
    PluginActionCtx<ActionCtx<T>, Universe> {
  db_cache: DBCache;
}

export interface ViewCtx<T>
  extends Ctx<T>,
    PluginViewCtx<ActionCtx<T>, Universe> {}

export interface Universe {
  db_cache: DBCache;
}

export interface RefCounts {
  [key: string]: {
    comps: Set<Comp>;
    unsubscribe: () => void;
  };
}

export type FetchData<T> =
  | { _fetching: true; _notFound?: never; data?: T }
  | { _notFound: true; _fetching?: never; data?: T }
  | { _fetching?: false; _notFound?: false; data: T };

export type Fetching<T> = FetchData<T>;
export type FetchAll<T> = FetchData<T[]>;

export interface Collection<T extends { id: string }> {
  ref: (key: string) => firebase.firestore.CollectionReference;

  // methods for actions
  get: (id: string) => Promise<T>;
  getAll: () => Promise<T[]>;
  set: (id: string, value: T) => Promise<void>;
  delete: (id: string) => Promise<void>;
  insert: (value: Omit<T, "id">) => Promise<string>;
  query: (query: Query<T>) => Promise<T[]>;

  // methods for react components
  // watch: (id: string) => Fetching<WithId<T>>;
  watchAll: (query?: Query<T>) => FetchAll<T>;
}

export interface Query<T> {
  where: [
    [keyof T, firebase.firestore.WhereFilterOp, any], // field, op, value
  ];
}
