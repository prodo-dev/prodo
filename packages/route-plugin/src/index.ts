import {
  createUniverseWatcher,
  PluginActionCtx,
  PluginViewCtx,
  ProdoPlugin,
} from "@prodo/core";
import { History } from "history";
import {
  Config,
  historySymbol,
  Routing,
  Universe,
  universeSymbol,
} from "./types";

const prepareContext = (ctx: Routing, history: History, universe: Universe) => {
  ctx[historySymbol] = history;
  ctx[universeSymbol] = universe;

  ctx.route = createUniverseWatcher("route");
};

const routingPlugin: ProdoPlugin<
  Config,
  Universe,
  Routing & PluginActionCtx<Routing, Universe>,
  Routing & PluginViewCtx<Routing, Universe>
> = (() => {
  return {
    name: "route",
    init: (config: Config, universe: Universe) => {
      const history = config.route.history;
      const currentPath = history.location.pathname;
      const searchParams = new URLSearchParams(history.location.search);
      const params: { [key: string]: string } = {};
      searchParams.forEach((value: string, key: string) => {
        params[key] = value;
      });
      universe.route = {
        path: currentPath,
        params,
      };
    },
    prepareActionCtx: (
      {
        ctx,
        universe,
      }: {
        ctx: Routing & PluginActionCtx<Routing, Universe>;
        universe: Universe;
      },
      config: Config,
    ) => prepareContext(ctx, config.route.history, universe),
    prepareViewCtx: (
      {
        ctx,
        universe,
      }: {
        ctx: Routing & PluginViewCtx<Routing, Universe>;
        universe: Universe;
      },
      config: Config,
    ) => prepareContext(ctx, config.route.history, universe),
  };
})();

export default routingPlugin;

export { push, replace } from "./actions";
export { Config, RouteParams } from "./types";
export { Route, Switch, Link, Redirect } from "./react";
export { matchRoute } from "./utils";
