import { action, PluginActionCtx } from "@prodo/core";
import {
  historySymbol,
  RouteParams,
  Routing,
  Universe,
  universeSymbol,
} from "./types";
import { createParamString } from "./utils";

export const push = action(
  (ctx: Routing & PluginActionCtx<Routing, Universe>) => (
    routeParams: RouteParams,
  ) => {
    ctx[historySymbol].push(
      routeParams.path + createParamString(routeParams.params),
    );
    ctx[universeSymbol].route = {
      path: routeParams.path,
      params: routeParams.params || {},
    };
  },
);

export const replace = action(
  (ctx: Routing & PluginActionCtx<Routing, Universe>) => (
    routeParams: RouteParams,
  ) => {
    ctx[historySymbol].replace(
      routeParams.path + createParamString(routeParams.params),
    );
    ctx[universeSymbol].route = {
      path: routeParams.path,
      params: routeParams.params || {},
    };
  },
);
