import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { TSRuleContext, TSRuleModule } from "../types/rules";
import { getParserServices } from "../utils/getParserServices";
import { identifierIsImportedFromModel } from "../utils/identifierIsImportedFromModel";

const rule: TSRuleModule = {
  meta: {
    docs: {
      description: "Requires that actions do not return.",
      category: "Possible Errors",
      recommended: true,
    },
    messages: {
      returningValue:
        "This function may be an action as it uses variables from model.ctx. Actions shouldn't return a value.",
      awaitingAction:
        "This function may be an action as it uses variables from model.ctx. Actions shouldn't await dispatched functions.",
    },
    schema: [
      {
        type: "object",
        properties: {
          noAwait: {
            type: "boolean",
          },
          noReturn: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
    type: "problem",
  },
  create(context: TSRuleContext) {
    const parserServices: ParserServices = getParserServices(context);

    let currentTopLevelFunctionNode:
      | TSESTree.FunctionDeclaration
      | TSESTree.FunctionExpression
      | TSESTree.ArrowFunctionExpression
      | undefined;
    let currentTopLevelFunctionReturns: boolean = false;
    let currentTopLevelFunctionAwaitsDispatchedFucntion: boolean = false;
    let currentTopLevelFunctionIsAction: boolean = false;

    let insideFunctionStackDepth = 0;

    const enterFunction = (
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
    ) => {
      if (insideFunctionStackDepth === 0) {
        currentTopLevelFunctionNode = node;
      }
      insideFunctionStackDepth++;
    };

    const exitFunction = () => {
      insideFunctionStackDepth--;
      if (insideFunctionStackDepth === 0) {
        checkAndRaiseIssue();
        currentTopLevelFunctionNode = undefined;
        currentTopLevelFunctionReturns = false;
        currentTopLevelFunctionAwaitsDispatchedFucntion = false;
        currentTopLevelFunctionIsAction = false;
      }
    };

    const checkAndRaiseIssue = () => {
      if (
        currentTopLevelFunctionNode != null &&
        currentTopLevelFunctionReturns &&
        currentTopLevelFunctionIsAction
      ) {
        context.report({
          node: currentTopLevelFunctionNode,
          messageId: "returningValue",
        });
      }
    };

    return {
      ":function"(
        node:
          | TSESTree.FunctionDeclaration
          | TSESTree.FunctionExpression
          | TSESTree.ArrowFunctionExpression,
      ) {
        enterFunction(node);
      },
      ":function:exit"() {
        exitFunction();
      },
      ":function Identifier"(node: TSESTree.Identifier): void {
        const modelImportNode = identifierIsImportedFromModel(
          node,
          parserServices,
        );
        if (
          modelImportNode &&
          modelImportNode.type === AST_NODE_TYPES.ImportSpecifier
        ) {
          currentTopLevelFunctionIsAction = true;
          checkAndRaiseIssue();
          return;
        }
      },
      ReturnStatement(): void {
        currentTopLevelFunctionReturns = true;
        checkAndRaiseIssue();
      },
    };
  },
};

export default rule;
