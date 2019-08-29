import { ProdoContext } from "./connect";
import { createModel } from "./model";
import { ProdoPlugin, Store } from "./types";

export const ProdoProvider = ProdoContext.Provider;

export { createModel, Store, ProdoPlugin };
