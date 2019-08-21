import { Patch } from "immer";
export const streamSymbol = Symbol("stream");

export interface Store<S> {
  state: S;
  history: History;
  eventsOrder: EventOrder[];
  rootActionsCount: number;

  streamStates: { [path: string]: StreamState };
  watchTree: WatchTree;
  trackHistory?: boolean;
}

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

export type Action<A> = (
  arg: A,
) => (store: Store<any>, origin?: Origin) => Promise<void>;

export type Dispatch = <T>(func: Action<T>) => (args: T) => void;

export type Track = <T, R>(func: (a: T) => R, a: T) => R;

export interface ActionCtx<State> {
  state: State;
  dispatch: Dispatch;
  track: Track;
  stream: CreateStream;
}

export type UserStream<A, T> = (arg: A) => Stream<T>;

export type CreateStream = <A, T>(
  userStream: UserStream<A, T>,
) => (arg: A) => T;

export interface Stream<T> {
  subscribe: (cb: (value: T) => void) => { unsubscribe: () => void };
}

export interface Event {
  actionName: string;
  args: any;
  id: string;
  isRoot: boolean;
  parentId: string | null;
  timeStart: number;
  timeEnd?: number;
  stateBefore: any;
  patches: Patch[];
  nextActions: NextAction[];
  effectsLog: any[];
  logs: any[];
  runtimeError: boolean;
  stateAfter?: any;
}

interface History {
  [key: string]: Event;
}

interface NextAction {
  func: Action<any>;
  args: any;
}

export interface EventOrder {
  type: "start" | "end";
  eventId: string;
}
