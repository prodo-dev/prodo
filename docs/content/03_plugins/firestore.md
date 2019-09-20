---
title: "Firestore"
order: 6
wip: true
---

Integration with the [Cloud
Firestore](https://firebase.google.com/docs/firestore) realtime database. Using
this plugin assumes you have a [Firestore database
setup](https://firebase.google.com/docs/firestore/quickstart).

## Add to your model

```ts
// src/model.ts
import firestore, { Collection } from "@prodo/firestore";

// ...

export interface DB {
  messages: Collection<{
    id: string;
    text: string;
    date: number;
  }>;
}

export const model = createModel<State>().with(effect);
export const { db /* ... */ } = model.ctx;
```

`Collection` a is type that represents a [Firestore
collection](https://firebase.google.com/docs/firestore/data-model) and is
parameterised by the type of each individual document. Document types must have
an `id` property on them. Sub collections are not currently supported.

## Config

Items added to the `createStore` config.

```ts
export interface Config {
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}
```

`firebaseConfig`

[Firebase config object](https://firebase.google.com/docs/web/setup).

## Usage

A database `Collection` has the following type. Some methods are intended to be
used in an action and others a component.

```ts
export interface Collection<T extends { id: string }> {
  // methods for actions
  get: (id: string) => Promise<T>;
  getAll: () => Promise<T[]>;
  set: (id: string, value: Omit<T, "id">) => Promise<void>;
  update: (id: string, value: Partial<T>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  insert: (value: Omit<T, "id">) => Promise<string>;
  query: (query: Query<T>) => Promise<T[]>;

  // methods for react components
  watch: (id: string) => Fetching<T>;
  watchAll: (query?: Query<T>) => FetchAll<T>;
}
```

A query has the following type. They map to [Firestore
queries](https://firebase.google.com/docs/firestore/query-data/queries).

```ts
export interface Query<T> {
  where?: [
    [keyof T, firebase.firestore.WhereFilterOp, any] // field, op, value
  ];
  orderBy?: [[keyof T] | [keyof T, "asc" | "desc"]];
  limit?: number;
}
```

### Actions

These methods can only be used in an action.

---

```ts
get(id: string) => Promise<T>
```

Get a single document by `id`.

**Example**

```ts
const message = await db.messages.get("message_id");
```

---

```ts
getAll() => Promise<T[]>
```

Get all documents in a collection.

**Example**

```ts
const messages = await db.messages.getAll();
```

---

```ts
set(id: string, value: Omit<T, "id">) => Promise<void>
```

Replace a document.

**Example**

```ts
await db.messages.set("message_id", {
  text: "newText",
  date: Date.now(),
});
```

---

```ts
update: (id: string, value: Partial<T>) => Promise<void>;
```

Update a document. This merges the current document with `value`.

**Example**

```ts
const messages = await db.messages.update("message_id", {
  text: "newText",
});
```

---

```ts
delete: (id: string) => Promise<id>
```

Delete a document.

**Example**

```ts
await db.messages.delete("message_id");
```

---

```ts
insert: (value: Omit<T, "id">) => Promise<string>;
```

Insert a new document into a collection. Returns the document id.

**Example**

```ts
const id = await db.messages.insert({
  text: "foo",
  date: Date.now(),
});
```

---

```ts
query: (query: Query<T>) => Promise<T[]>;
```

Get all documents that match a query.

**Example**

```ts
const messages = await db.messages.query({
  where: [["text", "==", "foo"]],
  orderBy: [["date", "desc"], ["text"]],
});
```

### Components

These methods can only be used in a component. They are all synchronous and will
subscribe the component to the data returned. The result will be in the format:

```ts
export type FetchData<T> =
  | { _fetching: true; _notFound?: false; data?: T }
  | { _notFound: true; _fetching?: false; data?: T }
  | { _fetching?: false; _notFound?: false; data: T };

export type Fetching<T> = FetchData<T>;
export type FetchAll<T> = FetchData<T[]>;
```

---

```
watch: (id: string) => Fetching<T>
```

Watch a single document.

**Example**

```tsx
const App = () => {
  const data = db.messages.watch("message_id");

  if (data._fetching) return <Loading />;
  if (data._notFound) return <Error />;

  return <Message message={data.data} />;
};
```

---

```
watchAll: (query?: Query) => FetchAll<T>
```

Watch multiple documents. Entire collection is watched unless query provided.

**Example**

```tsx
const App = () => {
  const data = db.messages.watchAll();

  if (data._fetching) return <Loading />;
  if (data._notFound) return <Error />;

  return (
    <div>
      {data.data.map(msg => (
        <Message message={msg} />
      ))}
    </div>
  );
};
```
