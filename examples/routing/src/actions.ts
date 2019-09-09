import { model } from "./model";

export const redirectHome = model.action(({ routing }) => () => {
  routing.replace({
    path: "/",
  });
});

export const redirectUser = model.action(({ routing }) => (user: string) => {
  routing.replace({
    path: "/user",
    params: {
      username: user,
    },
  });
});
