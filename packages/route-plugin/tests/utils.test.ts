import { matchRoute } from "../src";

describe("matchRoute", () => {
  it("can match a route", () => {
    expect(matchRoute("/a/b/c", "/a/b/c")).toBeTruthy();
    expect(matchRoute("/a/b/c", "/a/b/d")).toBeFalsy();
  });

  it("can partially match a route", () => {
    expect(matchRoute("/a/b/c", "/a/b")).toBeTruthy();
  });

  it("can exactly match a route", () => {
    expect(matchRoute("/a/b/c", "/a/b/c", true)).toBeTruthy();
    expect(matchRoute("/a/b/c", "/a/b/d", true)).toBeFalsy();
    expect(matchRoute("/a/b/c", "/a/b", true)).toBeFalsy();
  });

  it("can extract params from a match", () => {
    const match = matchRoute("/a/b/c", "/a/:prop1/:prop2");
    expect(match).toBeTruthy();
    expect(match.prop1).toBe("b");
    expect(match.prop2).toBe("c");
  });
});
