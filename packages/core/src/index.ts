import { ProdoContext } from "./connect";
import { createModel } from "./model";
import { ProdoPlugin, Store, Comp, PluginDispatch } from "./types";

export const ProdoProvider = ProdoContext.Provider;

export { createModel, Store, ProdoPlugin, Comp, PluginDispatch };
