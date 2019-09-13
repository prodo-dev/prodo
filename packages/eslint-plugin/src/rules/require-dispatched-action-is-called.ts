import * as ts from "@typescript-eslint/eslint-plugin";
import * as tsPluginUtil from "@typescript-eslint/eslint-plugin/dist/util";
import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { AST_NODE_TYPES, TSNode } from "@typescript-eslint/typescript-estree";
import { TSRuleContext, TSRuleModule } from "../types/rules";
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

  create(context: TSRuleContext) {
    let importsDispatchFromModel: boolean = false;
    let dispatchImportSymbol: ts.Symbol;
    const parserServices: ParserServices = tsPluginUtil.getParserServices(
      context,
    );

    const checker = parserServices.program!.getTypeChecker();
    return {
      ImportDeclaration: (node: TSESTree.ImportDeclaration): void => {
        const specifiers = node.specifiers;
        if (node.source.type === AST_NODE_TYPES.Literal) {
          if (matchModel(node.source.value as string)) {
            specifiers.forEach(specifier => {
              if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
                const specifierTsNode = parserServices.esTreeNodeToTSNodeMap!.get<
                  TSNode
                >(specifier);
                if (specifierTsNode.getFullText() === "dispatch") {
                  importsDispatchFromModel = true;
                  dispatchImportSymbol = (specifierTsNode as any).symbol;
                }
              }
            });
          }
        }
      },
      CallExpression: (node: TSESTree.CallExpression): void => {
        if (
          importsDispatchFromModel &&
          node &&
          node.callee.type === "Identifier" &&
          node.callee.name === "dispatch" &&
          node.parent &&
          node.parent.type !== "CallExpression"
        ) {
          const calleeNode = parserServices.esTreeNodeToTSNodeMap!.get<TSNode>(
            node.callee,
          );
          if (
            checker.getSymbolAtLocation(calleeNode) === dispatchImportSymbol
          ) {
            context.report({
              node,
              messageId: "mustBeCalled",
              data: { name: (node.callee as TSESTree.Identifier).name },
            });
          }
        }
      },
    };
  },
};

export default rule;
