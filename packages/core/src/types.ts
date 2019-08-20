export type Store<S> = {
  state: S;
  history: History;
  eventsOrder: EventOrder[];
  rootActionsCount: number;

  watchTree: WatchTree;
  trackHistory?: boolean;
};

export type WatchTree = {
  subs: Set<Node>; // subscriptions for branch
  esubs: Set<Node>; // subscriptions for leaf
  children: { [key: string]: WatchTree };
};

export type Node = {
  name: string;
  setState: (state: any) => void;
  pathKey: string;
  status: { unmounted: boolean };
  compId: number;
};

export type Watch = <T>(x: T) => T;

export type Origin = {
  parentId: string;
  id: string;
};

export type Action<A> = (
  arg: A,
) => (store: Store<any>, origin?: Origin) => Promise<void>;

export type Dispatch = <T>(func: Action<T>) => (args: T) => void;

export type Track = <T, R>(func: (a: T) => R, a: T) => R;

export type ActionCtx<State> = {
  state: State;
  dispatch: Dispatch;
  track: Track;
  stream: Stream;
};

export type CallBack<T> = (x: T) => void;

export type Stream = <A, T>(
  func: (a: A) => (cb: CallBack<T>) => void,
  arg: A,
) => T;

export type Event = {
  actionName: string;
  args: any;
  id: string;
  isRoot: boolean;
  parentId: string | null;
  timeStart: number;
  timeEnd?: number;
  stateBefore: any;
  patches: any[];
  nextActions: NextAction[];
  effectsLog: any[];
  logs: any[];
  runtimeError: boolean;
  stateAfter?: any;
};

type History = { [key: string]: Event };

type NextAction = {
  func: Action<any>;
  args: any;
};

export type EventOrder = { type: "start" | "end"; eventId: string };
