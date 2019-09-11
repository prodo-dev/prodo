import { TSESTree } from "@typescript-eslint/experimental-utils";
import { createRule } from "../utils/createRule";

export default createRule({
  name: "require-dispatched-action-is-called",
  meta: {
    docs: {
      description: "Requires that dispatched actions are called",
      category: "Possible Errors",
      recommended: "error",
      requiresTypeChecking: false,
    },
    messages: {
      mustBeCalled: "Dispatched actions must be called",
    },
    schema: [],
    type: "problem",
  },
  defaultOptions: [],

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
});
