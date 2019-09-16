import { Patch } from "immer";
import * as React from "react";
import { ProdoPlugin } from "./plugins";

export type Action<ActionCtx> = <A extends any[]>(
  func: (c: ActionCtx) => (...args: A) => void,
  name?: string,
) => (...args: A) => void;

export type Connect<ViewCtx> = <P>(
  func: (c: ViewCtx) => React.ComponentType<P>,
  name?: string,
) => React.ComponentType<P>;

export type With<InitOptions, Universe, ActionCtx, ViewCtx> = <I, U, A, V>(
  plugin: ProdoPlugin<I, U, A, V, any>,
) => Model<InitOptions & I, Universe & U, ActionCtx & A, ViewCtx & V>;

export interface Model<InitOptions, Universe, ActionCtx, ViewCtx> {
  createStore: (
    config: InitOptions,
  ) => {
    store: Store<InitOptions, Universe>;
    Provider: React.ComponentType<{ children: React.ReactNode }>;
  };
  action: Action<ActionCtx>;
  connect: Connect<ViewCtx>;
  with: With<InitOptions, Universe, ActionCtx, ViewCtx>;
  ctx: ActionCtx & ViewCtx;
}

export type Provider = React.ComponentType<{ children: React.ReactNode }>;

export type PluginDispatch<Ctx> = <A extends any[]>(
  func: (ctx: Ctx) => (...args: A) => void,
) => (...args: A) => void;

export interface Store<InitOptions, Universe> {
  config: InitOptions;
  universe: Universe;
  plugins: Array<ProdoPlugin<any, any, any, any, any>>;
  exec: <A extends any[]>(
    origin: Origin,
    func: (...args: A) => void,
    ...args: A
  ) => void;
  dispatch: <A extends any[]>(
    func: (...args: A) => void,
  ) => (...args: A) => Promise<Universe>;
  watchTree: WatchTree;
  trackHistory?: boolean;
  history: Event[];
  watchForComplete?: {
    count: number;
    cb: () => void;
  };
}

export type BaseStore<State> = Store<{ initState: State }, { state: State }>;

export interface WatchTree {
  subs: Set<Node>; // subscriptions for branch
  esubs: Set<Node>; // subscriptions for leaf
  children: { [key: string]: WatchTree };
}

export interface Comp {
  name: string;
  compId: number;
}

export interface Node extends Comp {
  pathKey: string;
  status: { unmounted: boolean };
  setState: (state: any) => void;
  unsubscribe?: (comp: Comp) => void;
}

export type Watch = <T>(x: T) => T;

export interface Origin {
  parentId: string | null;
  id: string;
}

export type Dispatch = <A extends any[]>(
  func: (...args: A) => void,
) => (...args: A) => void;

export interface Event {
  actionName: string;
  pluginName: string;
  args: any;
  id: string;
  parentId: string | null;
  patches: Patch[];
  nextActions: NextAction[];
  prevUniverse: any;
  nextUniverse?: any;
  rerender?: { [key: string]: boolean };
}

interface NextAction {
  func: (...c: any[]) => void;
  args: any;
  origin: Origin;
}

export interface EventOrder {
  type: "start" | "end";
  eventId: string;
}
