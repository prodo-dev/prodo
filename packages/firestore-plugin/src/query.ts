import * as firebase from "firebase/app";
import { Query } from "./types";

export const createFirestoreQuery = <T>(
  collection: firebase.firestore.CollectionReference,
  query?: Query<T>,
): firebase.firestore.Query => {
  let ref: firebase.firestore.Query = collection;

  if (query != null) {
    for (const [field, op, value] of query.where) {
      ref = ref.where(field.toString(), op, value);
    }
  }

  return ref;
};

export const createQueryName = <T>(
  collectionName: string,
  query?: Query<T>,
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
