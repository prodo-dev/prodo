import * as Babel from "@babel/core";
import * as _ from "lodash";
import visitComponentAndActions from "./components-and-actions";

export default (babel: typeof Babel): Babel.PluginObj => ({
  name: "prodo",
  visitor: visitComponentAndActions(babel),
});
