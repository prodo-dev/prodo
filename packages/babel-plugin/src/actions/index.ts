import * as Babel from "@babel/core";
import * as nodePath from "path";

type Context =
  | {
      importType: "specifiers";
      importDeclarationPath: Babel.NodePath<Babel.types.ImportDeclaration>;
      universe: Babel.types.ObjectPattern;
    }
  | {
      importType: "namespace";
      importDeclarationPath: Babel.NodePath<Babel.types.ImportDeclaration>;
      universe: Babel.types.Identifier;
    };

const visitAction = (
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
  let context: Context;
  bodyPath.traverse({
    Identifier(p: Babel.NodePath<Babel.types.Identifier>) {
      // Does it use `state` from `import {state} from "./model";`
      if (p.isReferencedIdentifier()) {
        const importPath = p.scope.getBinding(p.node.name).path;
        if (t.isImportSpecifier(importPath.node)) {
          if (importPath.node.imported.name === "state") {
            const importDeclarationPath = importPath.parentPath;
            if (t.isImportDeclaration(importDeclarationPath.node)) {
              const source = importDeclarationPath.node.source;
              if (
                source.value.startsWith(".") &&
                /^model(\.(j|t)s)?$/.test(nodePath.basename(source.value))
              ) {
                context = {
                  importType: "specifiers",
                  importDeclarationPath: importDeclarationPath as Babel.NodePath<
                    Babel.types.ImportDeclaration
                  >,
                  universe: t.objectPattern(
                    importDeclarationPath.node.specifiers
                      .map(specifier => {
                        if (t.isImportSpecifier(specifier)) {
                          return t.objectProperty(
                            specifier.imported,
                            specifier.local,
                            false,
                            specifier.imported.name === specifier.local.name,
                          );
                        }
                      })
                      .filter(x => x != null),
                  ),
                };
                p.stop();
              }
            }
          }
        }
      }
    },
    MemberExpression(p: Babel.NodePath<Babel.types.MemberExpression>) {
      // Does it use `prodo.state` from `import * as prodo from "./model";`
      if (!p.node.computed && p.node.property.name === "state") {
        const objectPath = p.get("object");
        if (
          t.isIdentifier(objectPath.node) &&
          objectPath.isReferencedIdentifier()
        ) {
          const importPath = objectPath.scope.getBinding(objectPath.node.name)
            .path;
          if (t.isImportNamespaceSpecifier(importPath.node)) {
            const importDeclarationPath = importPath.parentPath;
            if (t.isImportDeclaration(importDeclarationPath.node)) {
              const source = importDeclarationPath.node.source;
              if (
                source.value.startsWith(".") &&
                /^model(\.(j|t)s)?$/.test(nodePath.basename(source.value))
              ) {
                context = {
                  importType: "namespace",
                  importDeclarationPath: importDeclarationPath as Babel.NodePath<
                    Babel.types.ImportDeclaration
                  >,
                  universe: t.identifier(importPath.node.local.name),
                };
                p.stop();
              }
            }
          }
        }
      }
    },
  });

  if (context == null) {
    // Not an action
    return;
  }

  rootPath.replaceWith(
    t.variableDeclaration("const", [
      t.variableDeclarator(
        t.identifier(name),
        t.callExpression(
          t.memberExpression(
            context.importType === "namespace"
              ? t.memberExpression(context.universe, t.identifier("model"))
              : t.identifier("model"),
            t.identifier("action"),
          ),
          [
            t.arrowFunctionExpression(
              [context.universe],
              t.arrowFunctionExpression(params, bodyPath.node),
            ),
            t.stringLiteral(name),
          ],
        ),
      ),
    ]),
  );

  if (context.importType === "specifiers") {
    (context.importDeclarationPath as any).unshiftContainer(
      "specifiers",
      t.importSpecifier(t.identifier("model"), t.identifier("model")),
    );
  }
};

export default ({ types: t }: typeof Babel) => ({
  FunctionDeclaration(path: Babel.NodePath<Babel.types.FunctionDeclaration>) {
    const name = path.node.id.name;
    const bodyPath = path.get("body");

    visitAction(t, name, path, path.node.params, bodyPath);
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

    visitAction(t, name, path, declarationPath.node.init.params, bodyPath);
  },
});
