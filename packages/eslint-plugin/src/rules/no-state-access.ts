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
    const parserServices: ParserServices = tsPluginUtil.getParserServices(
      context,
    );
    const checker = parserServices.program!.getTypeChecker();
    let importsStateFromModel: boolean = false;
    let stateImportSymbol: ts.Symbol;
    const insideFunction: number[] = [];
    let insideImportDeclaration: boolean = false;

    return {
      FunctionDeclaration(node: TSESTree.FunctionDeclaration) {
        const functionTsNode = parserServices.esTreeNodeToTSNodeMap!.get<
          TSNode
        >(node);
        insideFunction.push(functionTsNode.pos);
      },
      FunctionExpression(node: TSESTree.FunctionExpression) {
        const functionTsNode = parserServices.esTreeNodeToTSNodeMap!.get<
          TSNode
        >(node);
        insideFunction.push(functionTsNode.pos);
      },
      ArrowFunctionExpression(node: TSESTree.ArrowFunctionExpression) {
        const functionTsNode = parserServices.esTreeNodeToTSNodeMap!.get<
          TSNode
        >(node);
        insideFunction.push(functionTsNode.pos);
      },
      "FunctionDeclaration:exit"() {
        insideFunction.pop();
      },
      "FunctionExpression:exit"() {
        insideFunction.pop();
      },
      "ArrowFunctionExpression:exit"() {
        insideFunction.pop();
      },

      ImportDeclaration(node: TSESTree.ImportDeclaration): void {
        insideImportDeclaration = true;
        const specifiers = node.specifiers;
        if (node.source.type === AST_NODE_TYPES.Literal) {
          if (matchModel(node.source.value as string)) {
            specifiers.forEach(specifier => {
              if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
                const specifierTsNode = parserServices.esTreeNodeToTSNodeMap!.get<
                  TSNode
                >(specifier);
                if (specifierTsNode.getFullText() === "state") {
                  importsStateFromModel = true;
                  stateImportSymbol = (specifierTsNode as any).symbol;
                }
              }
            });
          }
        }
      },
      "ImportDeclaration:exit"() {
        insideImportDeclaration = false;
      },

      Identifier(node: TSESTree.Identifier): void {
        if (
          !importsStateFromModel ||
          insideFunction.length !== 0 ||
          insideImportDeclaration
        ) {
          return;
        }
        const identifierTsNode = parserServices.esTreeNodeToTSNodeMap!.get<
          TSNode
        >(node);
        const symbol = checker.getSymbolAtLocation(identifierTsNode);
        if (symbol && symbol === stateImportSymbol) {
          context.report({
            node,
            messageId: "accessingState",
            data: { name: node.name },
          });
        }
      },
    };
  },
};

export default rule;
