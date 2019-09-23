import { History } from "history";

export interface RouteParams {
  path: string;
  params?: { [key: string]: string };
}

export const historySymbol = Symbol("@@routing/history");
export const universeSymbol = Symbol("@@routing/universe");
export const persistentSymbol = Symbol("@@routing/persistent");

export interface Universe {
  route: Required<RouteParams>;
}

export interface Routing {
  [historySymbol]: History;
  [universeSymbol]: Universe;
  route: Required<RouteParams>;
}

export interface Config {
  route: {
    history: History;
  };
}
