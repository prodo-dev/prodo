import { action } from "./action";
import { connect } from "./connect";
import { createStore } from "./store";
import { Dispatch, Model, ProdoPlugin, Watch } from "./types";

export const createModel = <State>(): Model<
  { initState: State },
  { state: State },
  { state: State; dispatch: Dispatch },
  { state: State; dispatch: Dispatch; watch: Watch }
> => {
  const plugins: Array<ProdoPlugin<any, any, any, any>> = [];

  const model: Model<any, any, any, any> = {
    createStore: config => createStore(config, plugins),
    action: action as any,
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
    ctx: {} as any,
  };

  return model as any;
};
