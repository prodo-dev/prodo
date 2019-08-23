import { ProdoContext } from "./connect";
import { createBaseModel } from "./model";
import effectPlugin from "./plugins/effects";
import { Store } from "./types";

export const Provider = ProdoContext.Provider;

export { createBaseModel, effectPlugin, Store };
