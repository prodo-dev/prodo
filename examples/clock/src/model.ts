import { createModel } from "@prodo/core";
import streamPlugin, { Stream } from "@prodo/stream";

export interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}

interface Streams {
  time?: Stream<Time>;
}

export const model = createModel<{}>().with(streamPlugin<Streams>());
export const { action, connect } = model;
export const { state } = model.ctx;
