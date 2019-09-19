import { PluginAction } from "@prodo/core";
import { historySymbol, RouteParams, Routing, universeSymbol } from "./types";
import { createParamString } from "./utils";

export const pushAction: PluginAction<
  Routing,
  [RouteParams | string]
> = ctx => (routeParams: RouteParams | string) => {
  if (typeof routeParams === "string") {
    routeParams = { path: routeParams };
  }
  ctx[historySymbol].push(
    routeParams.path + createParamString(routeParams.params),
  );
  ctx[universeSymbol].route = {
    path: routeParams.path,
    params: routeParams.params || {},
  };
};

export const replaceAction: PluginAction<
  Routing,
  [RouteParams | string]
> = ctx => (routeParams: RouteParams | string) => {
  if (typeof routeParams === "string") {
    routeParams = { path: routeParams };
  }
  ctx[historySymbol].replace(
    routeParams.path + createParamString(routeParams.params),
  );
  ctx[universeSymbol].route = {
    path: routeParams.path,
    params: routeParams.params || {},
  };
};
