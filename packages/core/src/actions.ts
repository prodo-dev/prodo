import produce from "immer";
import { completeEvent, startEvent } from "./events";
import logger from "./logger";
import {
  Action,
  ActionCtx,
  Dispatch,
  Origin,
  Store,
  Stream,
  Track,
} from "./types";

const track: Track = (func, a) => {
  logger.info("tracking", func, a);
  return func(a);
};

const stream: Stream = (func, arg) => {
  logger.info("stream not implemented", func, arg);
  return null as any;
};

export const createAction = <S>() => <A>(
  name: string,
  action: (arg: A) => (ctx: ActionCtx<S>) => void,
): Action<A> => (arg: A) => async (
  store: Store<S>,
  origin?: Origin,
): Promise<void> => {
  const currentState = store.state;
  const event = startEvent(store, name, arg, origin);

  const dispatch: Dispatch = func => args => {
    event.nextActions.push({ func, args });
  };

  const prevState = { ...store.state };

  try {
    const nextState = await produce(
      currentState,
      (state: S) => {
        action(arg)({ state, dispatch, track, stream });
      },
      (patches: any) => {
        event.patches = patches;
      },
    );

    logger.log("%c prev state ", "color: grey", prevState);
    logger.log(
      "%c action  %c%s   %c%s",
      "color: dodgerblue",
      "color: black; font-weight: thin",
      origin != null ? origin.id : event.id,
      "color: black; font-weight: bold",
      name,
      arg,
    );
    logger.log("%c next state ", "color: green", nextState);
    logger.log("");

    completeEvent(store, event);
  } catch (error) {
    completeEvent(store, event, error);
  }
};
