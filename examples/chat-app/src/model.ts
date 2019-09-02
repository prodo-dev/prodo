import { createModel } from "@prodo/core";
import firestorePlugin, { Collection } from "@prodo/firestore-plugin";

export interface Message {
  text: string;
  id: string;
  date: number;
}

export interface DB {
  messages: Collection<Message>;
}

export const model = createModel<{}>().with(firestorePlugin<DB>());
