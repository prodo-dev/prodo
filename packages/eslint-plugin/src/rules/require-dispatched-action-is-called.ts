import { TSESTree } from "@typescript-eslint/typescript-estree";
import { TSRuleContext, TSRuleModule } from "../types/rules";
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
    return {
      "CallExpression:not(CallExpression > CallExpression.callee)"(
        node: TSESTree.Node,
      ) {
        if (
          node.type !== "CallExpression" ||
          (node.type === "CallExpression" &&
            node.callee.type !== "MemberExpression" &&
            node.callee.type !== "Identifier")
        ) {
          return;
        }
        const callee = node.callee;
        if (callee.type === "Identifier") {
          const declaration = identifierIsImportedFromModel(callee, context);
          if (declaration && declaration.type === "ImportSpecifier") {
            if (declaration.imported.name === "dispatch") {
              context.report({
                node: callee,
                messageId: "mustBeCalled",
              });
            }
          }
        } else if (
          callee.type === "MemberExpression" &&
          callee.object.type === "Identifier"
        ) {
          const declaration = identifierIsImportedFromModel(
            callee.object,
            context,
          );
          if (declaration && declaration.type === "ImportNamespaceSpecifier") {
            if (
              callee.property.type === "Identifier" &&
              callee.property.name === "dispatch"
            ) {
              context.report({
                node: callee,
                messageId: "mustBeCalled",
              });
            }
          }
        }
      },
    };
  },
};

export default rule;
