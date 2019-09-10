import { push } from "@prodo/route";
import { model } from "./model";

export const redirectHome = model.action(({ dispatch }) => () => {
  dispatch(push)("/");
});

export const redirectUser = model.action(({ dispatch }) => (user: string) => {
  dispatch(push)({
    path: "/user",
    params: {
      username: user,
    },
  });
});
