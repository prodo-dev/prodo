import * as firebase from "firebase/app";
import { Query } from "./types";

export const createFirestoreQuery = (
  collection: firebase.firestore.CollectionReference,
  query?: Query,
): firebase.firestore.Query => {
  let ref: firebase.firestore.Query = collection;

  if (query != null) {
    for (const [field, op, value] of query.where) {
      ref = ref.where(field, op, value);
    }
  }

  return ref;
};

export const createQueryName = (
  collectionName: string,
  query?: Query,
): string => {
  if (query == null) {
    return `${collectionName}-all`;
  }

  const name = query.where.reduce(
    (name: string, [field, op, value]) =>
      `${name}-${field}${op}${value.toString()}`,
    collectionName,
  );

  return name;
};
