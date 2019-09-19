import { ProdoPlugin } from "@prodo/core";
import {
  Config,
  historySymbol,
  RouteParams,
  Routing,
  Universe,
  universeSymbol,
} from "./types";
import { createParamString } from "./utils";

export const createPush = (
  plugin: ProdoPlugin<Config, Universe, Routing, Routing>,
) =>
  plugin.action(
    ctx => (routeParams: RouteParams | string) => {
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
    },
    "push",
  );

export const createReplace = (
  plugin: ProdoPlugin<Config, Universe, Routing, Routing>,
) =>
  plugin.action(
    ctx => (routeParams: RouteParams | string) => {
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
    },
    "repalce",
  );
