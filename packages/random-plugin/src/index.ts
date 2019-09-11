import { PluginViewCtx, ProdoPlugin } from "@prodo/core";

export interface RandomConfig {
  possibilities: unknown[];
  delay: number;
}

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

const prepareActionCtx = ({
  ctx,
  universe,
}: {
  ctx: RandomActionCtx;
  universe: RandomUniverse;
}) => {
  ctx.random = universe.random;
};

const randomValue = (possibilities: unknown[]): unknown =>
  possibilities[Math.floor(Math.random() * possibilities.length)];

const updateRandomAction = ({ random }: RandomActionCtx) => (
  key: string,
  possibilities: unknown[],
) => {
  random[key] = randomValue(possibilities);
};

const prepareViewCtx = (
  {
    ctx,
    universe,
  }: {
    ctx: PluginViewCtx<RandomActionCtx, RandomUniverse> & RandomViewCtx;
    universe: RandomUniverse;
  },
  config: RandomConfig,
) => {
  ctx.random = (key: string) => {
    if (!universe.random[key]) {
      universe.random[key] = randomValue(config.possibilities);

      setInterval(() => {
        ctx.dispatch(updateRandomAction)(key, config.possibilities);
      }, config.delay);
    }

    ctx.subscribe(["random", key]);

    return universe.random[key];
  };
};

const randomPlugin = (): ProdoPlugin<
  RandomConfig,
  RandomUniverse,
  RandomActionCtx,
  RandomViewCtx
> => ({
  name: "random",
  init,
  prepareActionCtx,
  prepareViewCtx,
});

export default randomPlugin;
