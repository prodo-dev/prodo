import { TSESTree } from "@typescript-eslint/typescript-estree";
import { TSRuleContext, TSRuleModule } from "../types/rules";
import { findDefinition } from "../utils/findDefinition";
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
    let currentTopLevelFunctionReturns: boolean = false;
    let currentTopLevelFunctionAwaitsDispatchedFunction: boolean = false;
    let currentTopLevelFunctionIsAction: boolean = false;
    let currentTopLevelFunctionNode: TSESTree.Node | undefined;

    let insideFunctionStackDepth = 0;

    const enterFunction = (node: TSESTree.Node) => {
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
      ":function"(node: TSESTree.Node) {
        enterFunction(node);
      },
      ":function:exit"() {
        checkAndRaiseIssue();
        exitFunction();
      },
      ":function Identifier"(node: TSESTree.Node): void {
        if (node.type !== "Identifier") {
          return;
        }
        const importNode = findDefinition(node, context);
        if (importNode && identifierIsImportedFromModel(importNode)) {
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
        node: TSESTree.Node,
      ): void {
        if (node.type !== "CallExpression") {
          return;
        }
        const callee = node.callee;
        if (
          callee.type === "MemberExpression" &&
          callee.object.type === "Identifier" &&
          callee.property.type === "Identifier" &&
          callee.property.name === "dispatch"
        ) {
          const modelImport = findDefinition(callee.object, context);
          if (
            modelImport &&
            identifierIsImportedFromModel(modelImport) &&
            modelImport.type === "ImportNamespaceSpecifier"
          ) {
            currentTopLevelFunctionAwaitsDispatchedFunction = true;
          }
        } else if (callee.type === "Identifier" && callee.name === "dispatch") {
          const modelImport = findDefinition(callee, context);
          if (modelImport && identifierIsImportedFromModel(modelImport)) {
            currentTopLevelFunctionAwaitsDispatchedFunction = true;
          }
        }
      },
    };
  },
};

export default rule;
