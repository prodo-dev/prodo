import * as Babel from "@babel/core";
import * as pathLib from "path";
import injectUniverse from "./inject-universe";
import { isPossibleActionName, isPossibleComponentName } from "./utils";

const visitPossibleActionOrComponent = (
  t: typeof Babel.types,
  name: string,
  rootPath: Babel.NodePath<
    | Babel.types.FunctionDeclaration
    | Babel.types.ArrowFunctionExpression
    | Babel.types.FunctionExpression
  >,
  params: Array<
    | Babel.types.Identifier
    | Babel.types.Pattern
    | Babel.types.RestElement
    | Babel.types.TSParameterProperty
  >,
  bodyPath: Babel.NodePath<Babel.types.BlockStatement | Babel.types.Expression>,
  async?: boolean,
) => {
  if (isPossibleComponentName(name)) {
    injectUniverse(t, "component", name, rootPath, params, bodyPath, async);
  } else if (isPossibleActionName(name)) {
    injectUniverse(t, "action", name, rootPath, params, bodyPath, async);
  }
};

export default ({ types: t }: typeof Babel) => ({
  FunctionDeclaration(path: Babel.NodePath<Babel.types.FunctionDeclaration>) {
    if (path.node.id == null) {
      return;
    }

    const name = path.node.id.name;
    const bodyPath = path.get("body");
    visitPossibleActionOrComponent(
      t,
      name,
      path,
      path.node.params,
      bodyPath,
      path.node.async,
    );
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

    const name = t.isIdentifier(declarationPath.node.id)
      ? declarationPath.node.id.name
      : "unknown";
    const bodyPath = (declarationPath.get("init") as Babel.NodePath<
      Babel.types.ArrowFunctionExpression | Babel.types.FunctionExpression
    >).get("body");

    visitPossibleActionOrComponent(
      t,
      name,
      declarationPath.get("init") as Babel.NodePath<
        Babel.types.ArrowFunctionExpression | Babel.types.FunctionExpression
      >,
      declarationPath.node.init.params,
      bodyPath,
      declarationPath.node.init.async,
    );
  },
  AssignmentExpression(path: Babel.NodePath<Babel.types.AssignmentExpression>) {
    // exports.foo = bar syntax
    if (
      !t.isMemberExpression(path.node.left) ||
      !t.isIdentifier(path.node.left.object) ||
      path.node.left.object.name !== "exports"
    ) {
      // Not an export.
      return;
    }
    if (
      !t.isArrowFunctionExpression(path.node.right) &&
      !t.isFunctionExpression(path.node.right)
    ) {
      // Not exporting a function
    }

    const name = path.node.left.property.name;
    const bodyPath = (path.get("right") as Babel.NodePath<
      Babel.types.ArrowFunctionExpression | Babel.types.FunctionExpression
    >).get("body");

    visitPossibleActionOrComponent(
      t,
      name,
      path.get("right") as Babel.NodePath<
        Babel.types.ArrowFunctionExpression | Babel.types.FunctionExpression
      >,
      (path.node.right as
        | Babel.types.ArrowFunctionExpression
        | Babel.types.FunctionExpression).params,
      bodyPath,
      (path.node.right as
        | Babel.types.ArrowFunctionExpression
        | Babel.types.FunctionExpression).async,
    );
  },
  ExportDefaultDeclaration(
    path: Babel.NodePath<Babel.types.ExportDefaultDeclaration>,
    state: any,
  ) {
    const declarationPath = path.get("declaration");
    if (
      !(
        t.isArrowFunctionExpression(declarationPath.node) ||
        t.isFunctionExpression(declarationPath.node)
      )
    ) {
      // Not a function.
      return;
    }

    if (!state.file || !state.file.opts || !state.file.opts.filename) {
      return;
    }

    const name = /^[A-Z]/.test(pathLib.basename(state.file.opts.filename))
      ? "Default"
      : "default";
    const bodyPath = (declarationPath as Babel.NodePath<
      Babel.types.ArrowFunctionExpression | Babel.types.FunctionExpression
    >).get("body");

    visitPossibleActionOrComponent(
      t,
      name,
      declarationPath as Babel.NodePath<
        Babel.types.ArrowFunctionExpression | Babel.types.FunctionExpression
      >,
      declarationPath.node.params,
      bodyPath,
      declarationPath.node.async,
    );
  },
});
