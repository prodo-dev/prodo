import { Patch } from "immer";
import * as React from "react";

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

interface ProdoPluginSpec<InitOptions, Universe, ActionCtx, ViewCtx> {
  name: string;
  init?: (config: InitOptions, universe: Universe) => void;
  prepareActionCtx?: (
    env: {
      ctx: PluginActionCtx<ActionCtx, Universe> & ActionCtx;
      universe: Universe;
      event: any;
    },
    config: InitOptions,
  ) => void;
  prepareViewCtx?: (
    env: {
      ctx: PluginViewCtx<ActionCtx, Universe> & ViewCtx;
      universe: Universe;
      comp: Comp;
    },
    config: InitOptions,
  ) => void;
  onCompletedEvent?: (event: Event) => void;
  Provider?: Provider;
}

type PluginMandatoryKeys = "name";
type AtLeastOneOf<T, Keys extends keyof T> = {
  [K in Keys]-?: Required<Pick<T, K>> & Pick<T, Keys>;
}[Keys];
export type ProdoPlugin<InitOptions, Universe, ActionCtx, ViewCtx> = Pick<
  ProdoPluginSpec<InitOptions, Universe, ActionCtx, ViewCtx>,
  PluginMandatoryKeys
> &
  AtLeastOneOf<
    ProdoPluginSpec<InitOptions, Universe, ActionCtx, ViewCtx>,
    Exclude<
      keyof ProdoPluginSpec<InitOptions, Universe, ActionCtx, ViewCtx>,
      PluginMandatoryKeys
    >
  >;

export interface PluginActionCtx<ActionCtx, Universe> {
  dispatch: PluginDispatch<ActionCtx>;
  universe: Universe;
  rootDispatch: PluginDispatch<ActionCtx>;
}

export interface PluginViewCtx<ActionCtx, Universe> {
  dispatch: PluginDispatch<ActionCtx>;
  universe: Universe;
  subscribe: (path: string[], unsubscribe?: () => void) => void;
}

export type PluginDispatch<Ctx> = <A extends any[]>(
  func: (ctx: Ctx) => (...args: A) => void,
) => (...args: A) => void;

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
