import { History } from "history";

export interface RouteParams {
  path: string;
  params?: { [key: string]: string };
}

export const historySymbol = Symbol("@@routing/history");
export const universeSymbol = Symbol("@@routing/universe");

export interface Universe {
  route: {
    path: string;
    params: { [key: string]: string };
  };
}

export interface Routing {
  [historySymbol]: History;
  [universeSymbol]: Universe;
  route: {
    path: string;
    params: { [key: string]: string };
  };
}

export interface Config {
  route: {
    history: History;
  };
}
