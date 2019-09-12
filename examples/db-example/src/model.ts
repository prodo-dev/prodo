import { createModel } from "@prodo/core";
import firestorePlugin, { Collection } from "@prodo/firestore";

export interface State {
  lastSavedId?: string;
  lastLoadedId?: string;
  lastValue?: Stuff;
  lastError?: string;
  somethingEmpty: {};
}

export interface Stuff {
  id?: string;
  text: string;
  date: number;
}

export interface DB {
  stuff: Collection<Stuff>;
}

export const model = createModel<State>().with(firestorePlugin<DB>());
export const { db, state, dispatch, watch } = model.ctx;
