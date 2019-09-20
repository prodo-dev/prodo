import { mkUserAction } from "@prodo/core";
import plugin, { push as pushAction, replace as replaceAction } from "./plugin";

export const push = mkUserAction(pushAction);
export const replace = mkUserAction(replaceAction);

export default plugin;

export { Config, RouteParams } from "./types";
export { Route, Switch, Link, Redirect } from "./react";
export { matchRoute } from "./utils";
