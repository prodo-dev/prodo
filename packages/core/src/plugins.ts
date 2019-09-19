import { Comp, Event, PluginDispatch } from "./types";

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

export type PluginActionCtxFn<
  InitOptions,
  Universe,
  ActionCtx,
  CustomEvent = {}
> = (
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

export type PluginOnCompleteEventFn<InitOptions, CustomEvent> = (
  event: Event & CustomEvent,
  config: InitOptions,
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
  onCompleteEvent?: PluginOnCompleteEventFn<InitOptions, CustomEvent>;
}

export type PluginAction<ActionCtx, A extends any[]> = (
  ctx: ActionCtx,
) => (...args: A) => void;

export type PluginActionCreator<ActionCtx> = <A extends any[]>(
  func: (ctx: ActionCtx) => (...args: A) => void,
  actionName: string,
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
    completeEventFn: PluginOnCompleteEventFn<InitOptions, CustomEvent>,
  ) => void;
  action: PluginActionCreator<ActionCtx>;
  _internals: ProdoInternals<
    InitOptions,
    Universe,
    ActionCtx,
    ViewCtx,
    CustomEvent
  >;
}

export const mkUserAction = <ActionCtx, A extends any[]>(
  action: PluginAction<ActionCtx, A>,
): ((...args: A) => void) => {
  return action as any;
};

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
    action: (func, actionName) => {
      (func as any).__name = actionName;
      (func as any).__pluginName = name;
      return func as any;
    },
    _internals: prodoInternals,
  };
};
