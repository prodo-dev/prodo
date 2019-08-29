import { ProdoPlugin } from "@prodo/core";

interface RecordedEffect {
  start?: number;
  end?: number;
  name?: string;
  args?: any;
  value?: any;
}

interface EffectEvent {
  recordedEffects: RecordedEffect[];
}

export interface EffectConfig {
  mockEffects?: { [name: string]: any[] };
}

type Effect = <A extends any[], R>(
  func: (...args: A) => R,
) => (...args: A) => R;

export interface EffectActionCtx {
  effect: Effect;
}

const prepareActionCtx = (
  ctx: EffectActionCtx,
  config: EffectConfig,
  _universe: any,
  event: EffectEvent,
) => {
  event.recordedEffects = [];

  ctx.effect = <A extends any[]>(func: (...args: A) => any) => (
    ...args: A
  ): any => {
    const start = Date.now();
    const name = func.name;

    if (config.mockEffects && config.mockEffects[name]) {
      const mockedValue = config.mockEffects[name].shift();
      return mockedValue;
    }

    const result = func(...args);
    if (typeof result === "object" && result && result.then) {
      return result.then((value: any) => {
        const end = Date.now();
        event.recordedEffects.push({ start, end, name, args, value });
        return value;
      });
    } else {
      const end = Date.now();
      event.recordedEffects.push({ start, end, name, args, value: result });

      return result;
    }
  };
};

const effectPlugin: ProdoPlugin<
  EffectConfig,
  {},
  EffectActionCtx,
  {
    test: number;
  }
> = {
  prepareActionCtx,
};

export default effectPlugin;
