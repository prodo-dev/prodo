import * as Babel from "@babel/core";
import * as nodePath from "path";

const isModelContextImport = (importPath: string): boolean =>
  importPath.startsWith(".") &&
  /^model\.ctx(\.(j|t)sx?)?$/.test(nodePath.basename(importPath));

export default (
  t: typeof Babel.types,
  type: "action" | "component",
  name: string,
  rootPath: Babel.NodePath<
    | Babel.types.FunctionDeclaration
    | Babel.types.FunctionExpression
    | Babel.types.ArrowFunctionExpression
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
  const universeImports: {
    namespace?: string;
    specifiers: { [key: string]: string };
    specifierRest?: string;
    programPath?: Babel.NodePath<Babel.types.Program>;
    modelSource?: string;
  } = {
    specifiers: {},
  };

  bodyPath.traverse({
    Identifier(p: Babel.NodePath<Babel.types.Identifier>) {
      // Does it use `state` from `import {state} from "./model";`
      if (p.isReferencedIdentifier()) {
        const binding = p.scope.getBinding(p.node.name);
        if (binding != null) {
          const bindingPath = binding.path;

          if (
            (t.isImportSpecifier(bindingPath.node) ||
              t.isImportNamespaceSpecifier(bindingPath.node) ||
              t.isImportDefaultSpecifier(bindingPath.node)) &&
            t.isImportDeclaration(bindingPath.parent) &&
            isModelContextImport(bindingPath.parent.source.value)
          ) {
            universeImports.modelSource = bindingPath.parent.source.value.replace(
              /\.ctx(?=\.(j|t)sx?)?$/,
              "",
            );
            universeImports.programPath = bindingPath.parentPath
              .parentPath as Babel.NodePath<Babel.types.Program>;
            if (t.isImportSpecifier(bindingPath.node)) {
              // import {foo} from "./model.ctx";
              universeImports.specifiers[bindingPath.node.imported.name] =
                bindingPath.node.local.name;
            } else if (t.isImportNamespaceSpecifier(bindingPath.node)) {
              // import * as foo from "./model.ctx";
              universeImports.namespace = bindingPath.node.local.name;
            } else if (t.isImportDefaultSpecifier(bindingPath.node)) {
              // import foo from "./model.ctx";
              universeImports.specifiers.default = bindingPath.node.local.name;
            }
          } else if (
            t.isVariableDeclarator(bindingPath.node) &&
            t.isCallExpression(bindingPath.node.init) &&
            t.isIdentifier(bindingPath.node.init.callee) &&
            bindingPath.node.init.callee.name === "require" &&
            bindingPath.node.init.arguments.length === 1 &&
            t.isStringLiteral(bindingPath.node.init.arguments[0]) &&
            isModelContextImport(
              (bindingPath.node.init.arguments[0] as Babel.types.StringLiteral)
                .value,
            )
          ) {
            universeImports.modelSource = (bindingPath.node.init
              .arguments[0] as Babel.types.StringLiteral).value.replace(
              /\.ctx(?=\.(j|t)sx?)?$/,
              "",
            );
            universeImports.programPath = bindingPath.parentPath
              .parentPath as Babel.NodePath<Babel.types.Program>;
            if (t.isIdentifier(bindingPath.node.id)) {
              // const foo = require("./model.ctx");
              universeImports.namespace = bindingPath.node.id.name;
            } else if (t.isObjectPattern(bindingPath.node.id)) {
              const property = bindingPath.node.id.properties.find(
                (prop: Babel.types.ObjectProperty | Babel.types.RestElement) =>
                  t.isObjectProperty(prop)
                    ? t.isIdentifier(prop.value) &&
                      prop.value.name === p.node.name
                    : t.isIdentifier(prop.argument) &&
                      prop.argument.name === p.node.name,
              );
              if (property == null) {
                throw new Error(
                  "You are using require in a way that the transpiler can't understand.",
                );
              }
              if (t.isObjectProperty(property)) {
                // const {foo} = require("./model.ctx");
                universeImports.specifiers[
                  property.key.name
                ] = (property.value as Babel.types.Identifier).name;
              } else {
                // const {...foo} = require("./model.ctx");
                universeImports.specifierRest = (property.argument as Babel.types.Identifier).name;
              }
            }
          }
        }
      }
    },
  });

  if (
    universeImports.namespace == null &&
    Object.keys(universeImports.specifiers).length === 0 &&
    universeImports.specifierRest == null
  ) {
    // Doesn't use the universe, so don't change anything.
    return;
  }

  if (
    universeImports.namespace != null &&
    (Object.keys(universeImports.specifiers).length > 0 ||
      universeImports.specifierRest != null)
  ) {
    throw new Error(
      "Cannot import the context as both a namespace and using named imports.",
    );
  }

  // Insert `import { model } from "./src/model";
  if (
    universeImports.programPath != null &&
    universeImports.modelSource != null
  ) {
    const importDeclarationPath = universeImports.programPath
      .get("body")
      .find(
        expressionPath =>
          t.isImportDeclaration(expressionPath.node) &&
          expressionPath.node.source.value === universeImports.modelSource,
      );
    if (importDeclarationPath == null) {
      const importDeclaration = t.importDeclaration(
        [t.importSpecifier(t.identifier("model"), t.identifier("model"))],
        t.stringLiteral(universeImports.modelSource),
      );
      (universeImports.programPath as any).unshiftContainer(
        "body",
        importDeclaration,
      );
    } else {
      const hasModel = (importDeclarationPath.node as Babel.types.ImportDeclaration).specifiers.some(
        specifier =>
          t.isImportSpecifier(specifier) &&
          specifier.local.name === "model" &&
          specifier.imported.name === "model",
      );
      if (!hasModel) {
        (importDeclarationPath as any).unshiftContainer(
          "specifiers",
          t.importSpecifier(t.identifier("model"), t.identifier("model")),
        );
      }
    }
  }

  if (t.isFunctionDeclaration(rootPath.node)) {
    rootPath.replaceWith(
      t.variableDeclaration("const", [
        t.variableDeclarator(
          t.identifier(name),
          t.functionExpression(
            t.identifier(name),
            params,
            t.isBlockStatement(bodyPath.node)
              ? bodyPath.node
              : t.blockStatement([t.returnStatement(bodyPath.node)]),
            async,
          ),
        ),
      ]),
    );
    rootPath = rootPath.get("declarations")[0].get("init");
  }

  rootPath.replaceWith(
    t.callExpression(
      t.memberExpression(
        t.identifier("model"),
        t.identifier(type === "action" ? "action" : "connect"),
      ),
      [
        t.arrowFunctionExpression(
          [
            universeImports.namespace != null
              ? t.identifier(universeImports.namespace)
              : t.objectPattern([
                  ...Object.keys(universeImports.specifiers)
                    .sort()
                    .map(key =>
                      t.objectProperty(
                        t.identifier(key),
                        t.identifier(universeImports.specifiers[key]),
                        false,
                        key === universeImports.specifiers[key],
                      ),
                    ),
                  ...(universeImports.specifierRest != null
                    ? [
                        t.restElement(
                          t.identifier(universeImports.specifierRest),
                        ),
                      ]
                    : []),
                ]),
          ],
          rootPath.node as
            | Babel.types.FunctionExpression
            | Babel.types.ArrowFunctionExpression,
        ),
        t.stringLiteral(name),
      ],
    ),
  );
};
