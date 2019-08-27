import * as Babel from "@babel/core";
import * as nodePath from "path";

const makeVisitor = ({ types: t }: { types: typeof Babel.types }) => ({
  VariableDeclarator(path: Babel.NodePath<Babel.types.VariableDeclarator>) {
    const initNode = path.node.init;
    // We only care about functions
    if (
      !(
        t.isArrowFunctionExpression(initNode) ||
        t.isFunctionExpression(initNode)
      )
    ) {
      return;
    }
    const idNode = path.node.id;
    // Can't deal with strange declarations");
    if (!t.isIdentifier(idNode)) {
      return;
    }

    let isAction = false;
    let importSpecifier;
    (path.get("init") as Babel.NodePath<
      Babel.types.ArrowFunctionExpression | Babel.types.FunctionExpression
    >)
      .get("body")
      .traverse({
        Identifier(p: Babel.NodePath<Babel.types.Identifier>) {
          if (p.isReferencedIdentifier()) {
            const importPath = p.scope.getBinding(p.node.name).path;
            if (t.isImportSpecifier(importPath.node)) {
              const imported = importPath.node.imported.name;
              if (imported === "state") {
                const parentPath = importPath.parentPath;
                if (t.isImportDeclaration(parentPath.node)) {
                  const source = parentPath.node.source;
                  if (
                    source.value.startsWith(".") &&
                    nodePath.basename(source.value) === "model"
                  ) {
                    importSpecifier = parentPath;
                    isAction = true;
                  }
                }
              }
            }
          }
        },
      });

    if (!isAction) {
      return;
    }

    const name = idNode.name;
    path
      .get("init")
      .replaceWith(
        t.callExpression(
          t.memberExpression(t.identifier("model"), t.identifier("action")),
          [
            t.arrowFunctionExpression(
              [
                t.objectPattern([
                  t.objectProperty(
                    t.identifier("state"),
                    t.identifier("state"),
                    false,
                    true,
                  ),
                  t.objectProperty(
                    t.identifier("dispatch"),
                    t.identifier("dispatch"),
                    false,
                    true,
                  ),
                ]),
              ],
              path.node.init,
            ),
            t.stringLiteral(name),
          ],
        ),
      );

    importSpecifier.pushContainer(
      "specifiers",
      t.importSpecifier(t.identifier("model"), t.identifier("model")),
    );
  },
});

export default (babel: typeof Babel) => ({
  name: "prodo",
  visitor: makeVisitor(babel),
});
