import { CreateStream, streamSymbol } from "./types";

export const stream: CreateStream = userStream => arg => {
  return {
    [streamSymbol]: true,
    stream: userStream(arg),
  } as any;
};
