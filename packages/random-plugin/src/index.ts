import { createPlugin } from "@prodo/core";

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

const randomValue = (possibilities: unknown[]): unknown =>
  possibilities[Math.floor(Math.random() * possibilities.length)];

const plugin = createPlugin<
  RandomConfig,
  RandomUniverse,
  RandomActionCtx,
  RandomViewCtx
>("random");

const updateRandomAction = plugin.action(
  ({ random }) => (key: string, possibilities: unknown[]) => {
    random[key] = randomValue(possibilities);
  },
  "updateRandom",
);

plugin.init((_config, universe) => {
  universe.random = {};
});

plugin.prepareActionCtx(({ ctx, universe }) => {
  ctx.random = universe.random;
});

plugin.prepareViewCtx(({ ctx, universe }, config) => {
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
});

export default plugin;
