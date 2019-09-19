import { RouteParams } from "./types";
import plugin, { push as pushAction, replace as replaceAction } from "./plugin";

export const push = (pushAction as any) as (
  routeParams: RouteParams | string,
) => void;
export const replace = (replaceAction as any) as (
  routeParams: RouteParams | string,
) => void;

export default plugin;

export { Config, RouteParams } from "./types";
export { Route, Switch, Link, Redirect } from "./react";
export { matchRoute } from "./utils";
