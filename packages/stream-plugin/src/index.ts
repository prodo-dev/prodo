import {
  createPlugin,
  createUniverseWatcher,
  PluginActionCtx,
  ProdoPlugin,
  PluginAction,
} from "@prodo/core";

const valueSymbol = Symbol("streamValues");

interface StreamState {
  unsubscribe: () => void;
}

export interface Stream<T> {
  subscribe: (cb: (value: T) => void) => StreamState;
}

type UnStreams<T extends { [K in keyof T]?: Stream<any> }> = {
  [K in keyof T]?: T[K] extends Stream<infer V> ? V : never;
};

// Stores the latest values
export interface Universe<T extends { [K in keyof T]?: Stream<any> }> {
  streams: UnStreams<T>;
}

interface State<T extends { [K in keyof T]?: Stream<any> }> {
  streams: T;
  states: { [K in keyof T]?: StreamState };
}

export interface ViewCtx<T extends { [K in keyof T]?: Stream<any> }> {
  streams: UnStreams<T>;
}

export interface ActionCtx<T extends { [K in keyof T]?: Stream<any> }> {
  streams: T;
  // Private to streamUpdate
  [valueSymbol]: UnStreams<T>;
}

const init = <T extends { [K in keyof T]?: Stream<any> }>(
  _config: {},
  universe: Universe<T>,
) => {
  universe.streams = {};
};

const prepareActionCtx = <T extends { [K in keyof T]?: Stream<any> }>(
  state: State<T>,
  streamUpdate: PluginAction<ActionCtx<T>, [keyof T, any]>,
) => ({
  ctx,
  universe,
}: {
  ctx: PluginActionCtx<ActionCtx<T>, Universe<T>> & ActionCtx<T>;
  universe: Universe<T>;
}) => {
  ctx[valueSymbol] = universe.streams;
  ctx.streams = new Proxy(state.streams, {
    set: (obj, key: keyof T, value) => {
      const cb = (value: any) => {
        ctx.rootDispatch(streamUpdate)(key, value);
      };
      state.states[key] = value.subscribe(cb);
      obj[key] = value;
      return true;
    },
    deleteProperty: (obj, key: keyof T) => {
      const streamState = state.states[key];
      if (streamState != null) {
        streamState.unsubscribe();
      }
      delete universe.streams[key];
      delete state.states[key];
      delete obj[key];
      return true;
    },
  });
};

const prepareViewCtx = <T extends { [K in keyof T]?: Stream<any> }>({
  ctx,
}: {
  ctx: ViewCtx<T>;
}) => {
  ctx.streams = createUniverseWatcher("streams");
};

const streamPlugin = <
  T extends { [K in keyof T]?: Stream<any> }
>(): ProdoPlugin<{}, Universe<T>, ActionCtx<T>, ViewCtx<T>> => {
  const state: State<T> = {
    streams: {} as any,
    states: {},
  };

  const plugin = createPlugin<{}, Universe<T>, ActionCtx<T>, ViewCtx<T>>(
    "stream",
  );

  const streamUpdate = plugin.action(
    ctx => (key: keyof T, value: any) => {
      ctx[valueSymbol][key] = value;
    },
    "streamUpdate",
  );

  plugin.init(init);
  plugin.prepareActionCtx(prepareActionCtx<T>(state, streamUpdate));
  plugin.prepareViewCtx(prepareViewCtx);

  return plugin;
};

export default streamPlugin;
