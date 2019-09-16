import { Comp, PluginDispatch, Event } from "./types";

export interface PluginActionCtx<ActionCtx, Universe> {
  dispatch: PluginDispatch<ActionCtx>;
  universe: Universe;
  rootDispatch: PluginDispatch<ActionCtx>;
}

export interface PluginViewCtx<ActionCtx, Universe> {
  dispatch: PluginDispatch<ActionCtx>;
  universe: Universe;
  subscribe: (path: string[], unsubscribe?: (comp: Comp) => void) => void;
}

export type PluginInitFn<InitOptions, Universe> = (
  config: InitOptions,
  universe: Universe,
) => void;

export type PluginActionCtxFn<InitOptions, Universe, ActionCtx, CustomEvent> = (
  env: {
    ctx: PluginActionCtx<ActionCtx, Universe> & ActionCtx;
    universe: Universe;
    event: Event & CustomEvent;
  },
  config: InitOptions,
) => void;

export type PluginViewCtxFn<InitOptions, Universe, ActionCtx, ViewCtx> = (
  env: {
    ctx: PluginViewCtx<ActionCtx, Universe> & ViewCtx;
    universe: Universe;
    comp: Comp;
  },
  config: InitOptions,
) => void;

export type PluginOnCompleteEventFn<CustomEvent> = (
  event: Event & CustomEvent,
) => void;

export interface ProdoInternals<
  InitOptions,
  Universe,
  ActionCtx,
  ViewCtx,
  CustomEvent = {}
> {
  name: string;
  init?: PluginInitFn<InitOptions, Universe>;
  actionCtx?: PluginActionCtxFn<InitOptions, Universe, ActionCtx, CustomEvent>;
  viewCtx?: PluginViewCtxFn<InitOptions, Universe, ActionCtx, ViewCtx>;
  onCompleteEvent?: PluginOnCompleteEventFn<CustomEvent>;
}

export type PluginAction<ActionCtx> = <A extends any[]>(
  func: (ctx: ActionCtx) => (...args: A) => void,
  name: string,
) => (ctx: ActionCtx) => (...args: A) => void;

export interface ProdoPlugin<
  InitOptions,
  Universe,
  ActionCtx,
  ViewCtx,
  CustomEvent = {}
> {
  name: string;
  init: (initFn: PluginInitFn<InitOptions, Universe>) => void;
  prepareActionCtx: (
    actionCtxFn: PluginActionCtxFn<
      InitOptions,
      Universe,
      ActionCtx,
      CustomEvent
    >,
  ) => void;
  prepareViewCtx: (
    viewCtxFn: PluginViewCtxFn<InitOptions, Universe, ActionCtx, ViewCtx>,
  ) => void;
  onCompleteEvent: (
    completeEventFn: PluginOnCompleteEventFn<CustomEvent>,
  ) => void;
  action: PluginAction<ActionCtx>;
  _internals: ProdoInternals<
    InitOptions,
    Universe,
    ActionCtx,
    ViewCtx,
    CustomEvent
  >;
}

export const createPlugin = <
  InitOptions,
  Universe,
  ActionCtx,
  ViewCtx,
  CustomEvent = {}
>(
  name: string,
): ProdoPlugin<InitOptions, Universe, ActionCtx, ViewCtx, CustomEvent> => {
  const prodoInternals: ProdoInternals<
    InitOptions,
    Universe,
    ActionCtx,
    ViewCtx,
    CustomEvent
  > = {
    name,
  };

  return {
    name,
    init: initFn => {
      prodoInternals.init = initFn;
    },
    prepareActionCtx: actionCtxFn => {
      prodoInternals.actionCtx = actionCtxFn;
    },
    prepareViewCtx: viewCtxFn => {
      prodoInternals.viewCtx = viewCtxFn;
    },
    onCompleteEvent: onCompleteEventFn => {
      prodoInternals.onCompleteEvent = onCompleteEventFn;
    },
    action: (func, name) => {
      (func as any).__name = name;
      return func as any;
    },
    _internals: prodoInternals,
  };
};
