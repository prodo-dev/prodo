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
) => {
  if (isPossibleComponentName(name)) {
    injectUniverse(t, "component", name, rootPath);
  } else if (isPossibleActionName(name)) {
    injectUniverse(t, "action", name, rootPath);
  }
};

const extractName = (filePath: string) => {
  const basename = pathLib.basename(filePath);
  const fileName = basename.slice(
    0,
    basename.length - pathLib.extname(basename).length,
  );
  return fileName === "index"
    ? extractName(pathLib.dirname(filePath))
    : fileName.replace(/[-_](\w)/g, w => w.toUpperCase()).replace(/[-_]/g, "");
};

export default ({ types: t }: typeof Babel) => {
  const visitFunctionDeclaration = (
    path: Babel.NodePath<Babel.types.FunctionDeclaration>,
  ) => {
    if (path.node.id == null) {
      return;
    }

    visitPossibleActionOrComponent(t, path.node.id.name, path);
  };

  const visitFunctionExpression = (
    path: Babel.NodePath<
      Babel.types.ArrowFunctionExpression | Babel.types.FunctionExpression
    >,
    state: any,
  ) => {
    if (
      t.isVariableDeclarator(path.parent) &&
      t.isVariableDeclaration(path.parentPath.parent) &&
      (t.isProgram(path.parentPath.parentPath.parent) ||
        t.isExportNamedDeclaration(path.parentPath.parentPath.parent))
    ) {
      // const foo = () => {};
      // or
      // export const foo = () => {};
      if (!t.isIdentifier(path.parent.id)) {
        // const {foo} = () => {};
        return;
      }
      visitPossibleActionOrComponent(t, path.parent.id.name, path);
    } else if (
      t.isAssignmentExpression(path.parent) &&
      t.isMemberExpression(path.parent.left) &&
      t.isIdentifier(path.parent.left.object) &&
      path.parent.left.object.name === "exports" &&
      t.isExpressionStatement(path.parentPath.parent) &&
      t.isProgram(path.parentPath.parentPath.parent)
    ) {
      // exports.foo = () => {};
      visitPossibleActionOrComponent(t, path.parent.left.property.name, path);
    } else if (
      !t.isProgram(path.parent) &&
      t.isExportDefaultDeclaration(path.parent)
    ) {
      // export default () => {};

      // Need to work out whether it's a component or an action
      if (!state.file || !state.file.opts || !state.file.opts.filename) {
        return;
      }
      visitPossibleActionOrComponent(
        t,
        extractName(state.file.opts.filename),
        path,
      );
    }
  };

  return {
    FunctionDeclaration: visitFunctionDeclaration,
    FunctionExpression: visitFunctionExpression,
    ArrowFunctionExpression: visitFunctionExpression,
  };
};
