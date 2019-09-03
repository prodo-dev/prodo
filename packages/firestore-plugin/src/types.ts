import { PluginActionCtx, PluginViewCtx } from "@prodo/core";
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
    comps: Set<number>;
    unsubscribe: () => void;
  };
}

export type WithId<T> = T & { id: string };

export type FetchData<T> =
  | { _fetching: true; _notFound?: never; data?: T }
  | { _notFound: true; _fetching?: never; data?: T }
  | { _fetching?: false; _notFound?: false; data: T };

export type Fetching<T> = FetchData<WithId<T>>;
export type FetchAll<T> = FetchData<Array<WithId<T>>>;
export interface Collection<T> {
  ref: (key: string) => firebase.firestore.CollectionReference;

  // methods for actions
  get: (id: string) => Promise<WithId<T>>;
  getAll: () => Promise<Array<WithId<T>>>;
  set: (id: string, value: T) => Promise<void>;
  delete: (id: string) => Promise<void>;
  insert: (value: T) => Promise<string>;
  query: (query: Query) => Promise<Array<WithId<T>>>;

  // methods for react components
  watch: (id: string) => Fetching<WithId<T>>;
  watchAll: () => FetchAll<WithId<T>>;
}

export interface Query {
  where: [
    [
      string | firebase.firestore.FieldPath,
      firebase.firestore.WhereFilterOp,
      any,
    ], // field, op, value
  ];
}
