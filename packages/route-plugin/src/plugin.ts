import { createPlugin, createUniverseWatcher } from "@prodo/core";
import { History } from "history";
import { pushAction, replaceAction, setRouteAction } from "./actions";
import {
  Config,
  historySymbol,
  persistentSymbol,
  Routing,
  Universe,
  universeSymbol,
} from "./types";

const persistentContext = { isTimeTravelling: false };

const prepareContext = (ctx: Routing, history: History, universe: Universe) => {
  ctx[historySymbol] = history;
  ctx[universeSymbol] = universe;
  ctx[persistentSymbol] = persistentContext;

  ctx.route = createUniverseWatcher("route");
};

const plugin = createPlugin<Config, Universe, Routing, Routing>("route");

const parseParams = (search: string) => {
  const searchParams = new URLSearchParams(search);
  const params: { [key: string]: string } = {};
  searchParams.forEach((value: string, key: string) => {
    params[key] = value;
  });
  return params;
};

plugin.init((config, universe, store) => {
  const history = config.route.history;
  const currentPath = history.location.pathname;
  const params = parseParams(history.location.search);
  universe.route = {
    path: currentPath,
    params,
  };
  config.route.history.listen(location =>
    store.dispatch(setRoute)({
      path: location.pathname,
      params: parseParams(location.search),
    }),
  );
});

plugin.prepareActionCtx(({ ctx, universe }, config: Config) =>
  prepareContext(ctx, config.route.history, universe),
);

plugin.prepareViewCtx(({ ctx, universe }, config: Config) => {
  return prepareContext(ctx, config.route.history, universe);
});

export default plugin;

export const push = plugin.action(pushAction, "push");
export const replace = plugin.action(replaceAction, "replace");
export const setRoute = plugin.action(setRouteAction, "setRoute");
