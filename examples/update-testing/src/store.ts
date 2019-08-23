import { createBaseModel } from "@prodo/core";

export const numItems = 100;

export interface State {
  items: { [key: string]: boolean };
  numItems: number;
}

export const initState: State = {
  items: (new Array(numItems) as any).fill(10).reduce(
    (acc, _, id) => ({
      ...acc,
      [`${id}`]: false,
    }),
    {},
  ),
  numItems,
};

export const model = createBaseModel<State>();
