import { createPlugin, createUniverseWatcher } from "@prodo/core";
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

const plugin = createPlugin<Config, Universe, Routing, Routing>("route");

plugin.init((config, universe) => {
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
});

plugin.prepareActionCtx(({ ctx, universe }, config: Config) =>
  prepareContext(ctx, config.route.history, universe),
);

plugin.prepareViewCtx(({ ctx, universe }, config: Config) =>
  prepareContext(ctx, config.route.history, universe),
);

export default plugin;

export { push, replace } from "./actions";
export { Config, RouteParams } from "./types";
export { Route, Switch, Link, Redirect } from "./react";
