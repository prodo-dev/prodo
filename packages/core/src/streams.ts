import { CreateStream } from "./types";

export const stream: CreateStream = userStream => arg => {
  return userStream(arg) as any;
};
