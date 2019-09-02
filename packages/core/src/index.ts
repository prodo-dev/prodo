import { ProdoContext } from "./connect";
import { createModel } from "./model";
import {
  Comp,
  PluginActionCtx,
  PluginViewCtx,
  PluginDispatch,
  ProdoPlugin,
  Store,
} from "./types";

export const ProdoProvider = ProdoContext.Provider;

export {
  createModel,
  Store,
  ProdoPlugin,
  Comp,
  PluginViewCtx,
  PluginActionCtx,
  PluginDispatch,
};
