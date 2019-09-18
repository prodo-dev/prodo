import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { AST_NODE_TYPES, TSNode } from "@typescript-eslint/typescript-estree";
import { TSRuleContext, TSRuleModule } from "../types/rules";
import { getParserServices } from "../utils/getParserServices";
import { identifierIsImportedFromModel } from "../utils/identifierIsImportedFromModel";

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

    return {
      "Identifier:not(:function Identifier, ImportDeclaration Identifier)"(
        node: TSESTree.Identifier,
      ): void {
        const importNode = identifierIsImportedFromModel(node, parserServices);
        if (
          importNode &&
          importNode.type === AST_NODE_TYPES.ImportSpecifier &&
          node.name === "state"
        ) {
          context.report({
            node,
            messageId: "accessingState",
            data: { name: node.name },
          });
        } else if (
          importNode &&
          importNode.type === AST_NODE_TYPES.ImportNamespaceSpecifier
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
