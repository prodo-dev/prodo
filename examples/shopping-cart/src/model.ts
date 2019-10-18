import { createModel } from "@prodo/core";
import loggerPlugin from "@prodo/logger";
import routePlugin from "@prodo/route";

export interface Product {
  id: number;
  quantity: number;
  price: number;
  title: string;
}
export interface Cart {
  productId: number;
  quantity: number;
}
export interface State {
  total: number;
  products: Product[];
  carts: Cart[];
}

export const model = createModel<State>()
  .with(loggerPlugin)
  .with(routePlugin);

export const { state, watch, dispatch } = model.ctx;
