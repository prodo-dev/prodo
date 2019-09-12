import * as Babel from "@babel/core";
import * as pathLib from "path";

const isModelContextImport = (importPath: string): boolean =>
  importPath.startsWith(".") &&
  /^model(\.ctx)?(\.(j|t)sx?)?$/.test(pathLib.basename(importPath));

export default (
  t: typeof Babel.types,
  type: "action" | "component",
  name: string,
  path: Babel.NodePath<
    | Babel.types.FunctionDeclaration
    | Babel.types.FunctionExpression
    | Babel.types.ArrowFunctionExpression
  >,
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

  path.get("body").traverse({
    Identifier(p: Babel.NodePath<Babel.types.Identifier>) {
      // Does it use something from "./model.ctx"
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
              /(\.ctx)?(?=\.(j|t)sx?)?$/,
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
            // const foo = require("./model.ctx");
            universeImports.modelSource = (bindingPath.node.init
              .arguments[0] as Babel.types.StringLiteral).value.replace(
              /(\.ctx)?(?=\.(j|t)sx?)?$/,
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
  let modelImport: { namespace: string } | { specifier: string } | undefined;
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
      modelImport = { specifier: "model" };
    } else {
      if (
        (importDeclarationPath.node as Babel.types.ImportDeclaration).specifiers.some(
          specifier => t.isImportNamespaceSpecifier(specifier),
        )
      ) {
        modelImport = {
          namespace: (importDeclarationPath.node as Babel.types.ImportDeclaration).specifiers.find(
            specifier => t.isImportNamespaceSpecifier(specifier),
          )!.local.name,
        };
      } else if (
        (importDeclarationPath.node as Babel.types.ImportDeclaration).specifiers.some(
          specifier =>
            t.isImportSpecifier(specifier) &&
            specifier.imported.name === "model",
        )
      ) {
        modelImport = {
          specifier: (importDeclarationPath.node as Babel.types.ImportDeclaration).specifiers.find(
            specifier =>
              t.isImportSpecifier(specifier) &&
              specifier.imported.name === "model",
          )!.local.name,
        };
      } else {
        (importDeclarationPath as any).unshiftContainer(
          "specifiers",
          t.importSpecifier(t.identifier("model"), t.identifier("model")),
        );
        modelImport = { specifier: "model" };
      }
    }
  }

  if (modelImport == null) {
    throw new Error("Could not import the model.");
  }

  /* 
   * If it's a FunctionDeclaration, turn it into a VariableDeclaration
   * 
   * function foo () { ... }
   * 
   * becomes
   * 
   * const foo = function () { ... }
  `*/
  if (t.isFunctionDeclaration(path.node)) {
    path.replaceWith(
      t.variableDeclaration("const", [
        t.variableDeclarator(
          t.identifier(name),
          t.functionExpression(
            t.identifier(name),
            path.node.params,
            t.isBlockStatement(path.node.body)
              ? path.node.body
              : t.blockStatement([t.returnStatement(path.node.body)]),
            path.node.async,
          ),
        ),
      ]),
    );
    path = path.get("declarations")[0].get("init");
  }

  /*
   * Surround in model.action or model.connect
   *
   * const foo = () => { ... }
   *
   * becomes
   *
   * const foo = model.action(({state}) => () => { ... });
   */
  path.replaceWith(
    t.callExpression(
      t.memberExpression(
        "namespace" in modelImport
          ? t.memberExpression(
              t.identifier(modelImport!.namespace),
              t.identifier("model"),
            )
          : t.identifier(modelImport!.specifier),
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
          path.node as
            | Babel.types.FunctionExpression
            | Babel.types.ArrowFunctionExpression,
        ),
        t.stringLiteral(name),
      ],
    ),
  );
};
