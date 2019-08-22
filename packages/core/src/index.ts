import { createAction } from "./actions";
import { createConnect } from "./connect";
import { prodoRender } from "./render";
import { createTestRenderer, createTestDispatch } from "./testing";

export { createTestRenderer, createTestDispatch };

export default function<S>() {
  const action = createAction<S>();
  const connect = createConnect<S>();

  return { action, connect, render: prodoRender };
}
