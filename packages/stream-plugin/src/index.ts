import { ProdoPlugin, PluginActionCtx } from "@prodo/core";

const valueSymbol = Symbol("streamValues");

interface StreamState {
  unsubscribe: () => void;
}

export interface Stream<T> {
  subscribe: (cb: (value: T) => void) => StreamState;
}

type UnStreams<T extends { [K in keyof T]?: Stream<any> }> = {
  [K in keyof T]?: T[K] extends Stream<infer V> ? V : never
};

interface Config {}

// Stores the latest values
interface Universe<T extends { [K in keyof T]: Stream<any> | undefined }> {
  streams: UnStreams<T>;
}

interface State<T extends { [K in keyof T]: Stream<any> | undefined }> {
  streams: T;
  states: { [K in keyof T]?: StreamState };
}

type ViewCtx<T extends { [K in keyof T]?: Stream<any> }> = {
  streams: UnStreams<T>;
};

interface ActionCtx<T extends { [K in keyof T]?: Stream<any> }> {
  streams: T;
  // Private to streamUpdate
  [valueSymbol]: UnStreams<T>;
}

const init = <T extends { [K in keyof T]?: Stream<any> }>(
  _config: Config,
  universe: Universe<T>,
) => {
  universe.streams = {};
};

const streamUpdate = <T extends { [K in keyof T]?: Stream<any> }>(
  ctx: ActionCtx<T>,
) => (key: keyof T, value: any) => {
  ctx[valueSymbol][key] = value;
};

const prepareActionCtx = <T extends { [K in keyof T]?: Stream<any> }>(
  state: State<T>,
) => ({
  ctx,
  universe,
}: {
  ctx: PluginActionCtx<ActionCtx<T>> & ActionCtx<T>;
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
      state.states[key].unsubscribe();
      delete universe.streams[key];
      delete state.states[key];
      delete obj[key];
      return true;
    },
  });
};

const prepareViewCtx = <T extends { [K in keyof T]?: Stream<any> }>({
  ctx,
  universe,
}: {
  ctx: ViewCtx<T>;
  universe: Universe<T>;
}) => {
  ctx.streams = universe.streams;
};

const streamPlugin = <
  T extends { [K in keyof T]?: Stream<any> }
>(): ProdoPlugin<Config, Universe<T>, ActionCtx<T>, ViewCtx<T>> => {
  const state = {
    streams: {},
    states: {},
  };
  return {
    name: "stream",
    init,
    prepareActionCtx: prepareActionCtx(state),
    prepareViewCtx,
  };
};

export default streamPlugin;
