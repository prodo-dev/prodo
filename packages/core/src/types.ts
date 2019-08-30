import { Patch } from "immer";
import * as React from "react";
export const streamSymbol = Symbol("stream");

export type Action<ActionCtx> = <A extends any[]>(
  func: (c: ActionCtx) => (...args: A) => void,
  name?: string,
) => (...args: A) => void;

export type Connect<ViewCtx> = <P>(
  func: (c: ViewCtx) => React.ComponentType<P>,
  name?: string,
) => React.ComponentType<P>;

export type With<InitOptions, Universe, ActionCtx, ViewCtx> = <I, U, A, V>(
  plugin: ProdoPlugin<I, U, A, V>,
) => Model<InitOptions & I, Universe & U, ActionCtx & A, ViewCtx & V>;

export interface Model<InitOptions, Universe, ActionCtx, ViewCtx> {
  createStore: (config: InitOptions) => Store<InitOptions, Universe>;
  action: Action<ActionCtx>;
  connect: Connect<ViewCtx>;
  with: With<InitOptions, Universe, ActionCtx, ViewCtx>;
  ctx: ActionCtx & ViewCtx;
}

// @ts-ignore
export interface ProdoPlugin<InitOptions, Universe, ActionCtx, ViewCtx> {
  init?: (config: InitOptions, universe: any) => void;
  prepareActionCtx?: (
    ctx: any,
    config: InitOptions,
    universe: any,
    event: any,
  ) => void;
  prepareViewCtx?: (ctx: any, config: InitOptions, universe: any) => void;
}

export interface Store<InitOptions, Universe> {
  config: InitOptions;
  universe: Universe;
  plugins: Array<ProdoPlugin<any, any, any, any>>;
  exec: <A extends any[]>(
    origin: Origin,
    func: (...args: A) => void,
    ...args: A
  ) => void;
  dispatch: <A extends any[]>(
    func: (...args: A) => void,
  ) => (...args: A) => Promise<Universe>;
  streamStates: { [path: string]: StreamState };
  watchTree: WatchTree;
  trackHistory?: boolean;
  history: History;
  watchForComplete?: {
    count: number;
    cb: () => void;
  };
}

export type BaseStore<State> = Store<{ initState: State }, { state: State }>;

export interface StreamState {
  unsubscribe: () => void;
}

export interface WatchTree {
  subs: Set<Node>; // subscriptions for branch
  esubs: Set<Node>; // subscriptions for leaf
  children: { [key: string]: WatchTree };
}

export interface Node {
  name: string;
  setState: (state: any) => void;
  pathKey: string;
  status: { unmounted: boolean };
  compId: number;
}

export type Watch = <T>(x: T) => T;

export interface Origin {
  parentId: string;
  id: string;
}

export type Dispatch = <A extends any[]>(
  func: (...args: A) => void,
) => (...args: A) => void;

export type UserStream<A, T> = (arg: A) => Stream<T>;

export type CreateStream = <A, T>(
  userStream: UserStream<A, T>,
) => (arg: A) => T;

export interface Stream<T> {
  subscribe: (cb: (value: T) => void) => { unsubscribe: () => void };
}

export interface Event {
  actionName: string;
  id: string;
  parentId: string | null;
  patches: Patch[];
  nextActions: NextAction[];
  prevUniverse: any;
  nextUniverse?: any;
}

export interface History {
  [key: string]: Event;
}

interface NextAction {
  func: (c: any) => void;
  args: any;
  origin: Origin;
}

export interface EventOrder {
  type: "start" | "end";
  eventId: string;
}
