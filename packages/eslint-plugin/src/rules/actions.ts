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
    let currentTopLevelFunctionAwaitsDispatchedFunction: boolean = false;
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
        currentTopLevelFunctionAwaitsDispatchedFunction = false;
        currentTopLevelFunctionIsAction = false;
      }
    };

    const checkAndRaiseIssue = () => {
      if (
        currentTopLevelFunctionNode != null &&
        insideFunctionStackDepth === 1 &&
        currentTopLevelFunctionIsAction
      ) {
        if (currentTopLevelFunctionReturns) {
          context.report({
            node: currentTopLevelFunctionNode,
            messageId: "returningValue",
          });
        }
        if (currentTopLevelFunctionAwaitsDispatchedFunction) {
          context.report({
            node: currentTopLevelFunctionNode,
            messageId: "awaitingAction",
          });
        }
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
        checkAndRaiseIssue();
        exitFunction();
      },
      ":function Identifier"(node: TSESTree.Identifier): void {
        const modelImportNode = identifierIsImportedFromModel(
          node,
          parserServices,
        );
        if (modelImportNode) {
          currentTopLevelFunctionIsAction = true;
          return;
        }
      },
      ReturnStatement(): void {
        if (insideFunctionStackDepth === 1) {
          currentTopLevelFunctionReturns = true;
        }
      },
      ":function AwaitExpression[argument] CallExpression[callee] CallExpression"(
        node: TSESTree.CallExpression,
      ): void {
        const callee = node.callee;
        if (
          callee.type === AST_NODE_TYPES.MemberExpression &&
          callee.object.type === AST_NODE_TYPES.Identifier &&
          callee.property.type === AST_NODE_TYPES.Identifier &&
          callee.property.name === "dispatch"
        ) {
          const modelImport = identifierIsImportedFromModel(
            callee.object,
            parserServices,
          );
          if (
            modelImport &&
            modelImport.type === AST_NODE_TYPES.ImportNamespaceSpecifier
          ) {
            currentTopLevelFunctionAwaitsDispatchedFunction = true;
          }
        } else if (
          callee.type === AST_NODE_TYPES.Identifier &&
          callee.name === "dispatch" &&
          identifierIsImportedFromModel(callee, parserServices) != null
        ) {
          currentTopLevelFunctionAwaitsDispatchedFunction = true;
        }
      },
    };
  },
};

export default rule;
