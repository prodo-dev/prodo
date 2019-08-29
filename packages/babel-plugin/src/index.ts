import * as Babel from "@babel/core";
import { VisitNodeFunction } from "@babel/traverse";
import * as _ from "lodash";
import visitActions from "./actions";

const mergeVisitors = <S>(...visitors: Array<Babel.Visitor<S>>) =>
  _.merge(
    ...visitors,
    <P>(a: VisitNodeFunction<S, P>, b: VisitNodeFunction<S, P>) => (
      path: Babel.NodePath<P>,
      state: S,
    ) => {
      a.call(state, path, state);
      b.call(state, path, state);
    },
  );

export default (babel: typeof Babel): Babel.PluginObj => ({
  name: "prodo",

  visitor: mergeVisitors(visitActions(babel)),
});
