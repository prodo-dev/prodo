import {
  createPlugin,
  createUniverseWatcher,
  PluginAction,
  PluginOnCompleteEventFn,
  ProdoPlugin,
} from "@prodo/core";

const valueSymbol = Symbol("streamValues");
const deletedSymbol = Symbol("streamDeleted");

interface StreamState {
  unsubscribe: () => void;
}

export interface Stream<T> {
  subscribe: (cb: (value: T) => void) => StreamState;
}

export type UnStream<T extends Stream<any>> = T extends Stream<infer V>
  ? V
  : never;

export type UnStreams<T extends { [K in keyof T]: Stream<any> }> = {
  [K in keyof T]: UnStream<T[K]>;
};

// Stores the latest values
export interface Universe<T extends { [K in keyof T]: Stream<any> }> {
  streams: Partial<UnStreams<T>>;
}

interface State<T extends { [K in keyof T]: Stream<any> }> {
  streams: Partial<T>;
  states: { [K in keyof T]?: StreamState };
}

export interface ViewCtx<T extends { [K in keyof T]: Stream<any> }> {
  streams: Partial<UnStreams<T>>;
}

export interface ActionCtx<T extends { [K in keyof T]: Stream<any> }> {
  streams: Partial<T>;
  // Private to streamUpdate
  [valueSymbol]: Partial<UnStreams<T>>;
}

export interface Event<T extends { [K in keyof T]: Stream<any> }> {
  streams: { [K in keyof T]?: T[K] | (typeof deletedSymbol) };
}

const prepareActionCtx = <T extends { [K in keyof T]: Stream<any> }>({
  ctx,
  universe,
  event,
}: {
  ctx: ActionCtx<T>;
  universe: Universe<T>;
  event: Event<T>;
}) => {
  // For the streamUpdate action
  ctx[valueSymbol] = universe.streams;

  // For user actions
  event.streams = {};
  ctx.streams = new Proxy(event.streams as Partial<T>, {
    get: () => undefined,
    set: <K extends keyof T>(obj, key: K, value: T[K]) => {
      obj[key] = value;
      return true;
    },
    deleteProperty: (obj, key: keyof T) => {
      // Typescript doesn't know about proxies (github.com/microsoft/TypeScript/issues/20846)
      obj[key] = deletedSymbol as any;
      delete universe.streams[key];
      return true;
    },
  });
};

const onCompleteEvent = <T extends { [K in keyof T]: Stream<any> }>(
  state: State<T>,
  streamUpdate: PluginAction<ActionCtx<T>, [keyof T, any]>,
): PluginOnCompleteEventFn<{}, Event<T>, ActionCtx<T>> => ({
  event,
  rootDispatch,
}) => {
  (Object.keys(event.streams) as Array<keyof T>).forEach(key => {
    const stream = event.streams[key];

    // delete the old stream in all cases
    const streamState = state.states[key];
    if (streamState != null) {
      streamState.unsubscribe();
    }

    if (stream === deletedSymbol) {
      // proxy has already cleaned up universe
      delete state.states[key];
    } else if (stream != null) {
      const cb = (value: any) => {
        rootDispatch(streamUpdate)(key, value);
      };
      state.states[key] = stream.subscribe(cb);
    }
  });
};

const prepareViewCtx = <T extends { [K in keyof T]: Stream<any> }>({
  ctx,
}: {
  ctx: ViewCtx<T>;
}) => {
  ctx.streams = createUniverseWatcher("streams");
};

const streamPlugin = <T extends { [K in keyof T]: Stream<any> }>(): ProdoPlugin<
  {},
  Universe<T>,
  ActionCtx<T>,
  ViewCtx<T>,
  Event<T>
> => {
  const state: State<T> = {
    streams: {},
    states: {},
  };

  const plugin = createPlugin<
    {},
    Universe<T>,
    ActionCtx<T>,
    ViewCtx<T>,
    Event<T>
  >("stream");

  const streamUpdate = plugin.action(
    ctx => (key: keyof T, value: any) => {
      ctx[valueSymbol][key] = value;
    },
    "streamUpdate",
  );

  plugin.init((_config, universe) => {
    universe.streams = {};
  });
  plugin.prepareActionCtx(prepareActionCtx);
  plugin.prepareViewCtx(prepareViewCtx);
  plugin.onCompleteEvent(onCompleteEvent<T>(state, streamUpdate));

  return plugin;
};

export default streamPlugin;
