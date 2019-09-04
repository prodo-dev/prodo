import * as firebase from "firebase/app";
import { Query } from "./types";

export const createFirestoreQuery = (
  query: Query,
  collection: firebase.firestore.CollectionReference,
): firebase.firestore.Query => {
  let ref: firebase.firestore.Query = collection;

  for (const [field, op, value] of query.where) {
    ref = ref.where(field, op, value);
  }

  return ref;
};
