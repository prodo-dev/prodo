import {
  createUniverseWatcher,
  PluginActionCtx,
  PluginDispatch,
  PluginViewCtx,
  ProdoPlugin,
} from "@prodo/core";
import { createBrowserHistory, createMemoryHistory, History } from "history";

export interface RouteParams {
  path: string;
  params?: { [key: string]: string };
}

const historySymbol = Symbol("@@routing/history");
const universeSymbol = Symbol("@@routing/universe");

export interface Universe {
  route: RouteParams;
}

export interface Routing {
  [historySymbol]: History;
  [universeSymbol]: Universe;
  routing: {
    push: (params: RouteParams) => void;
    replace: (params: RouteParams) => void;
  };
  route: RouteParams;
}

export interface Config {
  routing?: {
    testMode?: boolean;
  };
}

const createParamString = (params?: { [key: string]: string }) => {
  const keys = Object.keys(params || {});
  if (keys.length === 0) {
    return "";
  }
  return `?${keys
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&")}`;
};

const pushAction = (ctx: Routing & PluginActionCtx<Routing, Universe>) => (
  routeParams: RouteParams,
) => {
  ctx[historySymbol].push(
    routeParams.path + createParamString(routeParams.params),
  );
  ctx[universeSymbol].route = {
    path: routeParams.path,
    params: routeParams.params || {},
  };
};

const replaceAction = (ctx: Routing & PluginActionCtx<Routing, Universe>) => (
  routeParams: RouteParams,
) => {
  ctx[historySymbol].replace(
    routeParams.path + createParamString(routeParams.params),
  );
  ctx[universeSymbol].route = {
    path: routeParams.path,
    params: routeParams.params || {},
  };
};

const prepareContext = (
  ctx: Routing,
  dispatch: PluginDispatch<Routing>,
  history: History,
  universe: Universe,
) => {
  ctx[historySymbol] = history;
  ctx[universeSymbol] = universe;

  const push = (routeParams: RouteParams) => {
    dispatch(pushAction)(routeParams);
  };
  const replace = (routeParams: RouteParams) => {
    dispatch(replaceAction)(routeParams);
  };

  ctx.routing = {
    push,
    replace,
  };
  ctx.route = createUniverseWatcher("route");
};

const routingPlugin: ProdoPlugin<
  Config,
  Universe,
  Routing & PluginActionCtx<Routing, Universe>,
  Routing & PluginViewCtx<Routing, Universe>
> = (() => {
  let history: History;
  return {
    name: "routing",
    init: (config: Config, universe: Universe) => {
      history =
        config.routing && config.routing.testMode
          ? createMemoryHistory()
          : createBrowserHistory();

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
    prepareActionCtx: ({
      ctx,
      universe,
    }: {
      ctx: Routing & PluginActionCtx<Routing, Universe>;
      universe: Universe;
    }) => prepareContext(ctx, ctx.dispatch, history, universe),
    prepareViewCtx: ({
      ctx,
      universe,
    }: {
      ctx: Routing & PluginViewCtx<Routing, Universe>;
      universe: Universe;
    }) => prepareContext(ctx, ctx.dispatch, history, universe),
  };
})();

export default routingPlugin;

export { Route, Switch } from "./react";
