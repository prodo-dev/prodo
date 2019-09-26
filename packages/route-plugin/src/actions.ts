import { PluginAction } from "@prodo/core";
import {
  historySymbol,
  persistentSymbol,
  RouteParams,
  Routing,
  universeSymbol,
} from "./types";
import { createParamString } from "./utils";

const normalizePath = (path: string): string =>
  path[0] !== "/" ? `/${path}` : path;

export const pushAction: PluginAction<
  Routing,
  [RouteParams | string]
> = ctx => (routeParams: RouteParams | string) => {
  if (typeof routeParams === "string") {
    routeParams = { path: routeParams };
  }

  routeParams = {
    ...routeParams,
    path: normalizePath(routeParams.path),
  };

  ctx[persistentSymbol].isTimeTravelling = true;
  ctx[universeSymbol].route = {
    path: routeParams.path,
    params: routeParams.params || {},
  };
  ctx[historySymbol].push(
    routeParams.path + createParamString(routeParams.params),
  );
};

export const replaceAction: PluginAction<
  Routing,
  [RouteParams | string]
> = ctx => (routeParams: RouteParams | string) => {
  if (typeof routeParams === "string") {
    routeParams = { path: routeParams };
  }

  routeParams = {
    ...routeParams,
    path: normalizePath(routeParams.path),
  };

  ctx[universeSymbol].route = {
    path: routeParams.path,
    params: routeParams.params || {},
  };
  ctx[persistentSymbol].isTimeTravelling = true;
  ctx[universeSymbol].route = {
    path: routeParams.path,
    params: routeParams.params || {},
  };
  ctx[historySymbol].replace(
    routeParams.path + createParamString(routeParams.params),
  );
};

export const setRouteAction: PluginAction<Routing, [RouteParams]> = ctx => (
  routeParams: RouteParams,
) => {
  if (!ctx[persistentSymbol].isTimeTravelling) {
    ctx[universeSymbol].route = {
      path: normalizePath(routeParams.path),
      params: routeParams.params || {},
    };
  } else {
    ctx[persistentSymbol].isTimeTravelling = false;
  }
};
