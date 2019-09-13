import { createModel } from "@prodo/core";
import streamPlugin, { Stream } from "@prodo/stream-plugin";

interface Event {
  time: string;
  sym: string;
}

export interface Quote extends Event {
  ask: number;
  bid: number;
}

export interface Trade extends Event {
  price: number;
  size: number;
}


export interface Streams {
  quotes: Stream<Quote[]>;
  trades: Stream<Trade[]>;
}

export const model = createModel<{}>().with(streamPlugin<Streams>());
export const { action, connect } = model;
export const { state } = model.ctx;
