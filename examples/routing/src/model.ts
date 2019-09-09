import { createModel } from "@prodo/core";
import routingPlugin from "@prodo/routing-plugin";

// tslint:disable-next-line:no-empty-interface
export interface State {}

export const model = createModel<State>().with(routingPlugin);
