import * as React from "react";
import { Store } from "./types";

export interface ProdoContextType {
  store: Store<any>;
}

export const ProdoContext = React.createContext<ProdoContextType>({
  store: (null as any) as Store<any>,
});
