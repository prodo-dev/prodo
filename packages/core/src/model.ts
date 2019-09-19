import { action } from "./action";
import { connect } from "./connect";
import { ProdoPlugin } from "./plugins";
import { createStore } from "./store";
import { Dispatch, Model, Watch } from "./types";

export const createModel = <State>(): Model<
  { initState: State },
  { state: State },
  { state: State; dispatch: Dispatch },
  { state: State; dispatch: Dispatch; watch: Watch }
> => {
  const plugins: Array<ProdoPlugin<any, any, any, any>> = [];

  const model: Model<any, any, any, any> = {
    createStore: config => createStore(config, plugins),
    action,
    connect,
    with: (p: ProdoPlugin<any, any, any, any>) => {
      plugins.push(p);
      return model;
    },
    ctx: {} as any,
  };

  return model as any;
};
