import { createModel } from "@prodo/core";
// import devToolsPlugin from "@prodo/devtools-plugin";
import routingPlugin from "@prodo/route";

// tslint:disable-next-line:no-empty-interface
export interface State {}

export const model = createModel<State>().with(routingPlugin);
// .with(devToolsPlugin);
