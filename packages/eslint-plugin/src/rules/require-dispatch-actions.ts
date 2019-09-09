import * as util from "@typescript-eslint/eslint-plugin/dist/util";
import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { TSNode } from "@typescript-eslint/typescript-estree";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "actions must be dispatched",
      category: "Possible Errors" as
        | "Possible Errors"
        | "Best Practices"
        | "Stylistic Issues"
        | "Variables",
      recommended: false as false | "error" | "warn",
      url: "",
    },
    messages: {
      dispatchAction: "Must dispatch actions",
    },
    fixable: null,
    schema: [],
  },

  create(context: any) {
    console.log(context);
    const parserServices: ParserServices = util.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();

    return {
      CallExpression(node: TSESTree.CallExpression): void {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get<TSNode>(node);
        const type = checker.getTypeAtLocation(tsNode);
        context.report({
          node,
          messageId: "actions must be dispatched",
          data: { name: (node.callee as TSESTree.Identifier).name, type },
        });
      },
    };
  },
};
