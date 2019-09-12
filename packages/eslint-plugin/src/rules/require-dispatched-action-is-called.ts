import { TSESTree } from "@typescript-eslint/experimental-utils";
import { TSRuleModule } from "../types/rules";

const rule: TSRuleModule = {
  meta: {
    docs: {
      description: "Requires that dispatched actions are called",
      category: "Possible Errors",
    },
    messages: {
      mustBeCalled: "Dispatched actions must be called",
    },
    schema: [],
    type: "problem",
  },

  create(context: any) {
    return {
      CallExpression(node: TSESTree.CallExpression): void {
        if (
          node &&
          node.callee.type === "Identifier" &&
          node.callee.name === "dispatch" &&
          node.parent.type !== "CallExpression"
        ) {
          context.report({
            node,
            messageId: "mustBeCalled",
            data: { name: (node.callee as TSESTree.Identifier).name },
          });
        }
      },
    };
  },
};

export default rule;
