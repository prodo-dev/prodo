import * as Babel from "@babel/core";
import injectUniverse from "./inject-universe";
import { isPossibleActionName, isPossibleComponentName } from "./utils";

const visitPossibleAction = (
  t: typeof Babel.types,
  name: string,
  rootPath: Babel.NodePath<
    Babel.types.FunctionDeclaration | Babel.types.VariableDeclaration
  >,
  params: Array<
    | Babel.types.Identifier
    | Babel.types.Pattern
    | Babel.types.RestElement
    | Babel.types.TSParameterProperty
  >,
  bodyPath: Babel.NodePath<Babel.types.BlockStatement | Babel.types.Expression>,
) => {
  if (isPossibleComponentName(name)) {
    injectUniverse(t, "component", name, rootPath, params, bodyPath);
  } else if (isPossibleActionName(name)) {
    injectUniverse(t, "action", name, rootPath, params, bodyPath);
  }
};

export default ({ types: t }: typeof Babel) => ({
  FunctionDeclaration(path: Babel.NodePath<Babel.types.FunctionDeclaration>) {
    const name = path.node.id.name;
    const bodyPath = path.get("body");
    visitPossibleAction(t, name, path, path.node.params, bodyPath);
  },
  VariableDeclaration(path: Babel.NodePath<Babel.types.VariableDeclaration>) {
    if (path.node.declarations.length !== 1) {
      // Not yet supported
      return;
    }

    const declarationPath = path.get("declarations")[0];
    if (
      !(
        t.isArrowFunctionExpression(declarationPath.node.init) ||
        t.isFunctionExpression(declarationPath.node.init)
      )
    ) {
      // Not a function.
      return;
    }

    if (!t.isIdentifier(declarationPath.node.id)) {
      // Not yet supported.
      return;
    }

    const name = declarationPath.node.id.name;
    const bodyPath = (declarationPath.get("init") as Babel.NodePath<
      Babel.types.ArrowFunctionExpression | Babel.types.FunctionExpression
    >).get("body");

    visitPossibleAction(
      t,
      name,
      path,
      declarationPath.node.init.params,
      bodyPath,
    );
  },
});
