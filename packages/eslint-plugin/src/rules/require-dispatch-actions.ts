import * as tsPluginUtil from "@typescript-eslint/eslint-plugin/dist/util";
import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { TSNode } from "@typescript-eslint/typescript-estree";
import { createRule } from "../utils/createRule";

export default createRule({
  name: "require-dispatch-actions",
  meta: {
    docs: {
      description: "Requires that actions must be dispatched",
      category: "Possible Errors",
      recommended: "error",
      requiresTypeChecking: true,
    },
    messages: {
      dispatch: "Must dispatch actions.",
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

    return {
      CallExpression(node: TSESTree.CallExpression): void {
        const callee = parserServices.esTreeNodeToTSNodeMap.get<TSNode>(
          node.callee,
        );
        const type = checker.getTypeAtLocation(callee);
        context.report({
          node,
          messageId: "dispatch",
          data: { name: (node.callee as TSESTree.Identifier).name, type },
        });
      },
    };
  },
});
