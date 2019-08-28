import { ProdoContext } from "./connect";
import { createModel } from "./model";
import effectPlugin from "./plugins/effects";
import localPlugin from "./plugins/local";
import { Store } from "./types";

export const ProdoProvider = ProdoContext.Provider;

export { createModel, effectPlugin, localPlugin, Store };
