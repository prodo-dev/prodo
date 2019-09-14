import { createModel } from "@prodo/core";
import firestorePlugin, { Collection } from "@prodo/firestore";
import loggerPlugin from "@prodo/logger";

export interface Message {
  text: string;
  date: number;
  id: string;
}

export interface DB {
  messages: Collection<Message>;
}

export interface State {
  pinnedMessage?: string;
}

export const model = createModel<State>()
  .with(firestorePlugin<DB>())
  .with(loggerPlugin);

export const { state, dispatch, db, watch } = model.ctx;
