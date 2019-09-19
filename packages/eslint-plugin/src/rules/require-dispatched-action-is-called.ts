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
      description: "Requires that dispatched actions are called",
      category: "Possible Errors",
    },
    messages: {
      mustBeCalled: "Dispatched actions must be called immediately",
    },
    schema: [],
    type: "problem",
  },

  create(context: TSRuleContext) {
    const parserServices: ParserServices = getParserServices(context);

    const handleSpecifierImport = (node: TSESTree.Identifier) => {
      if (node.type === "Identifier") {
        const importDeclaration = identifierIsImportedFromModel(
          node,
          parserServices,
        );
        if (importDeclaration != null) {
          context.report({
            node,
            messageId: "mustBeCalled",
            data: { name: node.name },
          });
        }
      }
    };

    const handleNamespaceImport = (node: TSESTree.MemberExpression) => {
      const propertyTSNode = parserServices.esTreeNodeToTSNodeMap!.get<TSNode>(
        node.property,
      );
      if (node.object.type === AST_NODE_TYPES.Identifier) {
        const importDeclaration = identifierIsImportedFromModel(
          node.object,
          parserServices,
        );
        if (importDeclaration && propertyTSNode.getText() === "dispatch") {
          context.report({
            node: node.property,
            messageId: "mustBeCalled",
            data: {
              name: (node.property as TSESTree.Identifier).name,
            },
          });
        }
      }
    };
    return {
      CallExpression: (node: TSESTree.CallExpression): void => {
        if (
          node.parent &&
          node.parent.type === AST_NODE_TYPES.CallExpression &&
          node === node.parent.callee
        ) {
          return;
        }
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "dispatch"
        ) {
          handleSpecifierImport(node.callee);
        } else if (node.callee.type === "MemberExpression") {
          handleNamespaceImport(node.callee);
        }
      },
    };
  },
};

export default rule;
