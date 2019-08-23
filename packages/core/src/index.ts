// import { createAction } from "./actions";
// import { createConnect } from "./connect";
// import { prodoRender } from "./render";
// import { createTestDispatch, createTestRenderer } from "./testing";

// export { createTestRenderer, createTestDispatch };

// export default function<S>() {
//   const action = createAction<S>();
//   const connect = createConnect<S>();

//   return { action, connect, render: prodoRender };
// }

import { ProdoContext } from "./connect";
import { createBaseModel } from "./model";

export const Provider = ProdoContext.Provider;

export { createBaseModel };
