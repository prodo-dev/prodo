import { connect } from "./connect";
import { createBaseStore } from "./store";
import { Dispatch, Model, ProdoPlugin, Watch } from "./types";

export const createBaseModel = <State>(): Model<
  { initState: State },
  { state: State },
  { state: State; dispatch: Dispatch },
  { state: State; dispatch: Dispatch; watch: Watch }
> => {
  const plugins: Array<ProdoPlugin<any, any, any, any>> = [];

  const model = {
    createStore: config => createBaseStore(config, plugins),
    action(func, name = "(anonymous action)") {
      (func as any).__name = name;
      return func;
    },
    connect(func: any, name = "(anonymous component)") {
      return connect(
        func,
        name,
      );
    },
    with: p => {
      plugins.push(p);
      return model;
    },
  };

  return model as any;
};
