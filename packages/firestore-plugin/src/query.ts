import * as firebase from "firebase/app";
import { Query } from "./types";

export const createFirestoreQuery = <T>(
  collection: firebase.firestore.CollectionReference,
  query?: Query<T>,
): firebase.firestore.Query => {
  let ref: firebase.firestore.Query = collection;

  if (query != null) {
    // where
    if (query.where) {
      for (const [field, op, value] of query.where) {
        ref = ref.where(field.toString(), op, value);
      }
    }

    // orderBy
    if (query.orderBy) {
      for (const orderBy of query.orderBy) {
        ref = ref.orderBy(
          orderBy[0].toString(),
          orderBy.length === 2 ? orderBy[1] : undefined,
        );
      }
    }

    // limit
    if (query.limit) {
      ref = ref.limit(query.limit);
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

  let name = collectionName;

  if (query.where) {
    name = query.where.reduce(
      (name: string, [field, op, value]) =>
        `${name}-${field}${op}${value.toString()}`,
      name,
    );
  }

  if (query.orderBy) {
    name = query.orderBy.reduce(
      (name: string, orderBy) =>
        `${name}-${orderBy[0]}${orderBy.length === 2 ? "-" + orderBy[1] : ""}`,
      name,
    );
  }

  if (query.limit) {
    name = `${name}-${query.limit}`;
  }

  return name;
};
