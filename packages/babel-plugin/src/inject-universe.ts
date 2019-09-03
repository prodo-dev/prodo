import * as Babel from "@babel/core";
import * as nodePath from "path";
import { isInUniverse } from "./utils";

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

export default (
  t: typeof Babel.types,
  type: "action" | "component",
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
  async?: boolean,
) => {
  let context: Context;
  bodyPath.traverse({
    Identifier(p: Babel.NodePath<Babel.types.Identifier>) {
      // Does it use `state` from `import {state} from "./model";`
      if (p.isReferencedIdentifier()) {
        const binding = p.scope.getBinding(p.node.name);
        if (binding != null) {
          const importPath = binding.path;
          if (
            t.isImportSpecifier(importPath.node) &&
            isInUniverse(importPath.node.imported.name)
          ) {
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
                      .filter(specifier => t.isImportSpecifier(specifier))
                      .filter((specifier: Babel.types.ImportSpecifier) =>
                        isInUniverse(specifier.imported.name),
                      )
                      .map((specifier: Babel.types.ImportSpecifier) =>
                        t.objectProperty(
                          specifier.imported,
                          specifier.local,
                          false,
                          specifier.imported.name === specifier.local.name,
                        ),
                      ),
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
      if (!p.node.computed && isInUniverse(p.node.property.name)) {
        const objectPath = p.get("object");
        if (
          t.isIdentifier(objectPath.node) &&
          objectPath.isReferencedIdentifier()
        ) {
          const binding = objectPath.scope.getBinding(objectPath.node.name);
          if (binding != null) {
            const importPath = binding.path;
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
      }
    },
  });

  if (context == null) {
    // Doesn't use the universe, so don't change anything.
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
            t.identifier(type === "action" ? "action" : "connect"),
          ),
          [
            t.arrowFunctionExpression(
              [context.universe],
              t.arrowFunctionExpression(params, bodyPath.node, async),
            ),
            t.stringLiteral(name),
          ],
        ),
      ),
    ]),
  );

  if (
    context.importType === "specifiers" &&
    !context.importDeclarationPath.node.specifiers.some(
      specifier =>
        t.isImportSpecifier(specifier) &&
        specifier.imported.name === "model" &&
        specifier.local.name === "model",
    )
  ) {
    (context.importDeclarationPath as any).unshiftContainer(
      "specifiers",
      t.importSpecifier(t.identifier("model"), t.identifier("model")),
    );
  }
};
