import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { AST_NODE_TYPES, TSNode } from "@typescript-eslint/typescript-estree";
import { TSRuleContext, TSRuleModule } from "../types/rules";
import { getParserServices } from "../utils/getParserServices";
import { identifierIsImported } from "../utils/matchIdentifierToImport";
import { nameImportedFromModel } from "../utils/nameIsImportedFromModel";

const rule: TSRuleModule = {
  meta: {
    docs: {
      description:
        "Requires that the state variable is only accessed inside a component or action",
      category: "Possible Errors",
      recommended: true,
    },
    messages: {
      accessingState:
        "Trying to access the state variable. This is empty outside components or functions.",
    },
    schema: [],
    type: "problem",
  },
  create(context: TSRuleContext) {
    const parserServices: ParserServices = getParserServices(context);
    let importsStateFromModel: boolean = false;
    let stateImportNode: TSESTree.ImportSpecifier | undefined;
    let modelImportNode: TSESTree.ImportNamespaceSpecifier | undefined;
    let insideFunctionStackDepth = 0;
    let insideImportDeclaration: boolean = false;

    return {
      FunctionDeclaration() {
        insideFunctionStackDepth++;
      },
      FunctionExpression() {
        insideFunctionStackDepth++;
      },
      ArrowFunctionExpression() {
        insideFunctionStackDepth++;
      },
      "FunctionDeclaration:exit"() {
        insideFunctionStackDepth--;
      },
      "FunctionExpression:exit"() {
        insideFunctionStackDepth--;
      },
      "ArrowFunctionExpression:exit"() {
        insideFunctionStackDepth--;
      },

      ImportDeclaration(node: TSESTree.ImportDeclaration): void {
        insideImportDeclaration = true;
        const result = nameImportedFromModel(node, parserServices, "state");
        stateImportNode = result.namedImportNode;
        modelImportNode = result.modelImportNode;
        importsStateFromModel =
          stateImportNode != null || modelImportNode != null;
      },
      "ImportDeclaration:exit"() {
        insideImportDeclaration = false;
      },

      Identifier(node: TSESTree.Identifier): void {
        if (
          !importsStateFromModel ||
          insideFunctionStackDepth !== 0 ||
          insideImportDeclaration
        ) {
          return;
        }
        if (
          stateImportNode &&
          identifierIsImported(node, stateImportNode, parserServices)
        ) {
          context.report({
            node,
            messageId: "accessingState",
            data: { name: node.name },
          });
        } else if (
          modelImportNode &&
          identifierIsImported(node, modelImportNode, parserServices)
        ) {
          const parentNode = node.parent;
          if (
            parentNode &&
            parentNode.type === AST_NODE_TYPES.MemberExpression
          ) {
            const propertyTSNode = parserServices.esTreeNodeToTSNodeMap!.get<
              TSNode
            >(parentNode.property);
            if (propertyTSNode.getText() === "state" && propertyTSNode) {
              context.report({
                node: parentNode.property,
                messageId: "accessingState",
                data: {
                  name: (parentNode.property as TSESTree.Identifier).name,
                },
              });
            }
          }
        }
      },
    };
  },
};

export default rule;
