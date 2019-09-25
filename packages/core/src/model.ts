import { action } from "./action";
import { connect } from "./connect";
import { ProdoPlugin } from "./plugins";
import { createStore } from "./store";
import { Dispatch, Model, Watch } from "./types";

const invalidCtxUseMessage = (value: string | number | symbol) =>
  `Cannot use ${value.toString()} outside of an action or React component.`;

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
    ctx: new Proxy(
      {},
      {
        get(_target, key) {
          throw new Error(invalidCtxUseMessage(key));
        },
        set(_target, key) {
          throw new Error(invalidCtxUseMessage(key));
        },
      },
    ),
  };

  return model as any;
};
