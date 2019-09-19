import { createModel } from "@prodo/core";
import { createMemoryHistory } from "history";
import routePlugin, { push, replace } from "../src";

const model = createModel<{}>().with(routePlugin);

describe("route plugin", () => {
  it("", async () => {
    const history = createMemoryHistory();

    const { store } = model.createStore({
      initState: {},
      route: { history },
    });

    let route = store.universe.route;
    expect(route.path).toBe("/");
    expect(route.params).toEqual({});
    expect(history.length).toBe(1);

    route = (await store.dispatch(push)("/test-1")).route;
    expect(route.path).toBe("/test-1");
    expect(route.params).toEqual({});
    expect(history.length).toBe(2);
    route = (await store.dispatch(push)({
      path: "/test-2",
      params: { foo: "bar" },
    })).route;
    expect(route.path).toBe("/test-2");
    expect(route.params).toEqual({ foo: "bar" });
    expect(history.length).toBe(3);

    route = (await store.dispatch(replace)("/test-3")).route;
    expect(route.path).toBe("/test-3");
    expect(route.params).toEqual({});
    expect(history.length).toBe(3);
  });
});
