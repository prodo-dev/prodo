import { createModel } from "@prodo/core";
import streamPlugin, { Stream } from "@prodo/stream";

export interface Streams {
  [key: string]: Stream<number>;
}

export const model = createModel<{}>().with(streamPlugin<Streams>());
