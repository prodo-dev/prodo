import { createModel } from "@prodo/core";
import streamPlugin, { Stream } from "@prodo/stream-plugin";

export interface KxEvent {
  time: string;
  sym: string;
}

export interface KxQuote extends KxEvent {
  ask: number;
  bid: number;
}

export interface KxTrade extends KxEvent {
  price: number;
  size: number;
}

interface AppEvent {
  time: Date;
  sym: string;
}

export interface Quote extends AppEvent {
  ask: number;
  bid: number;
}

export interface Trade extends AppEvent {
  price: number;
  size: number;
}


export interface Streams {
  quotes: Stream<{[key: string]: Quote}>;
  trades: Stream<{[key: string]: Trade}>;
  quoteHistory: Stream<{[key: string]: Quote[]}>;
  tradeHistory: Stream<{[key: string]: Trade[]}>;
}

export const model = createModel<{}>().with(streamPlugin<Streams>());
export const { action, connect } = model;
export const { state } = model.ctx;
