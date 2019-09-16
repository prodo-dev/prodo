import { ProdoContext } from "./connect";

export const ProdoProvider = ProdoContext.Provider;

export { action } from "./action";
export { connect, createUniverseWatcher, ProdoContext } from "./connect";
export { createModel } from "./model";

export { Comp, PluginDispatch, Provider, Store } from "./types";

export {
  ProdoPlugin,
  createPlugin,
  PluginActionCreator,
  PluginInitFn,
  PluginViewCtx,
  PluginActionCtx,
  PluginViewCtxFn,
  PluginActionCtxFn,
  PluginOnCompleteEventFn,
} from "./plugins";
