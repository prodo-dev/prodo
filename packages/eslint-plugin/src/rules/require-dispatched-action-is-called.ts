import * as tsPluginUtil from "@typescript-eslint/eslint-plugin/dist/util";
import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { AST_NODE_TYPES, TSNode } from "@typescript-eslint/typescript-estree";
import { TSRuleModule } from "../types/rules";
import { matchModel } from "../utils/matchModel";

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

  create(context: any) {
    let importsDispatchFromModel: boolean = false;
    const parserServices: ParserServices = tsPluginUtil.getParserServices(
      context,
    );

    return {
      ImportDeclaration(path: TSESTree.ImportDeclaration): void {
        const specifiers = path.specifiers;
        if (path.source.type === AST_NODE_TYPES.Literal) {
          if (matchModel(path.source.value as string)) {
            specifiers.forEach(specifier => {
              if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
                const specifierTsNode = parserServices.esTreeNodeToTSNodeMap.get<
                  TSNode
                >(specifier);
                if (specifierTsNode.getFullText() === "dispatch") {
                  importsDispatchFromModel = true;
                }
              }
            });
          }
        }
      },
      CallExpression(node: TSESTree.CallExpression): void {
        if (
          importsDispatchFromModel &&
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
