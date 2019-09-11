import * as tsPluginUtil from "@typescript-eslint/eslint-plugin/dist/util";
import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { TSNode, AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { createRule } from "../utils/createRule";
import * as ts from "typescript";

export default createRule({
  name: "require-provider",
  meta: {
    docs: {
      description:
        "Requires that the ProdoProvider component is wrapped around the App component",
      category: "Possible Errors",
      recommended: "error",
      requiresTypeChecking: true,
    },
    messages: {
      missingProvider:
        "Must wrap ProdoProvider component around the App component.",
    },
    schema: [],
    type: "problem",
  },
  defaultOptions: [],

  create(context: any) {
    const parserServices: ParserServices = tsPluginUtil.getParserServices(
      context,
    );
    const checker = parserServices.program.getTypeChecker();

    let providerType: ts.Type;
    let importsProvider: boolean;
    let importsreactDom: boolean;

    return {
      JsxOpeningElement(path: TSESTree.JSXElement): void {
        const parentNode = parserServices.esTreeNodeToTSNodeMap.get<TSNode>(
          path.parent,
        );
      },
      CallExpression(path: TSESTree.CallExpression): void {
        const callee = parserServices.esTreeNodeToTSNodeMap.get<TSNode>(
          path.callee,
        );
        const type = checker.getTypeAtLocation(callee);
        context.report({
          path,
          messageId: "dispatch",
          data: { name: (path.callee as TSESTree.Identifier).name, type },
        });
      },
      ImportDeclaration(path: TSESTree.ImportDeclaration): void {
        const specifiers = path.specifiers;
        if (path.source.type === AST_NODE_TYPES.Literal) {
          if (path.source.value === "@prodo/core") {
            specifiers.forEach(specifier => {
              if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
                const specifierTsNode = parserServices.esTreeNodeToTSNodeMap.get<
                  TSNode
                >(path);
                if (specifierTsNode.getFullText() === "ProdoProvider") {
                  providerType = checker.getTypeAtLocation(specifierTsNode);
                  importsProvider = true;
                }
              }
            });
          } else if (path.source.value === "react-dom") {
            importsreactDom = true;
          }
        }
      },
    };
  },
});
