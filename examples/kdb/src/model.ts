import { createModel } from "@prodo/core";
import streamPlugin, { Stream } from "@prodo/stream-plugin";

interface Event {
  time: string;
  sym: string;
}

interface Quote extends Event {
  ask: number;
  bid: number;
}

interface Trade extends Event {
  price: number;
  size: number;
}


interface Streams {
  quotes?: Stream<Quote[]>;
  trades?: Stream<Trade[]>;
}

export const model = createModel<{}>().with(streamPlugin<Streams>());
export const { action, connect } = model;
export const { state } = model.ctx;
