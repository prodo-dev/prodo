import { createModel } from "@prodo/core";
import firestorePlugin, { Collection } from "@prodo/firestore";

export interface Stuff {
  text: string;
  date: number;
}

export interface DB {
  stuff: Collection<Stuff>;
}

export const model = createModel<{}>().with(firestorePlugin<DB>());
export const { db, state, dispatch, watch } = model.ctx;
