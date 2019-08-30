import { ProdoPlugin, PluginDispatch } from "@prodo/core";

export interface RandomUniverse {
  random: { [key: string]: any };
}

export interface RandomActionCtx {
  random: { [key: string]: any };
}

export interface RandomViewCtx {
  random: (key: string) => any;
}

const init = (_config: any, universe: RandomUniverse) => {
  universe.random = {};
};

const prepareActionCtx = (
  ctx: RandomActionCtx,
  _config: unknown,
  universe: RandomUniverse,
  _event: unknown,
) => {
  ctx.random = universe.random;
};

const updateRandomAction = ({ random }: RandomActionCtx) => (
  key: string,
  value: any,
) => {
  random[key] = value;
};

const prepareViewCtx = (
  ctx: RandomViewCtx,
  _config: any,
  universe: RandomUniverse,
  _comp: any,
  subscribe: (path: string[]) => void,
  dispatch: PluginDispatch<RandomActionCtx>,
) => {
  ctx.random = (key: string) => {
    if (!universe.random[key]) {
      universe.random[key] = Math.random();

      setInterval(() => {
        dispatch(updateRandomAction)(key, Math.random());
      }, 1000);
    }

    subscribe(["random", key]);

    return universe.random[key];
  };
};

const randomPlugin = (): ProdoPlugin<
  {},
  RandomUniverse,
  {},
  RandomViewCtx
> => ({
  init,
  prepareActionCtx,
  prepareViewCtx,
});

export default randomPlugin;
