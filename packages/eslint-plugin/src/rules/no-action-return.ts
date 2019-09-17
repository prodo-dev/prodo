import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { TSRuleContext, TSRuleModule } from "../types/rules";
import { getParserServices } from "../utils/getParserServices";
import { identifierIsImported } from "../utils/matchIdentifierToImport";
import { matchModel } from "../utils/nameIsImportedFromModel";

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
    },
    schema: [],
    type: "problem",
  },
  create(context: TSRuleContext) {
    const parserServices: ParserServices = getParserServices(context);
    let importsFromModel: boolean = false;
    const namedImportsFromModelNodes: TSESTree.ImportSpecifier[] = [];
    let modelImportNode: TSESTree.ImportNamespaceSpecifier | undefined;

    let currentTopLevelFunctionNode:
      | TSESTree.FunctionDeclaration
      | TSESTree.FunctionExpression
      | TSESTree.ArrowFunctionExpression
      | undefined;
    let currentTopLevelFunctionReturns: boolean | undefined;
    let currentTopLevelFunctionUsesModel: boolean | undefined;
    let currentTopLevelFunctionHasRaised: boolean | undefined;

    let insideFunctionStackDepth = 0;

    const enterFunction = (
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
    ) => {
      insideFunctionStackDepth++;
      if (insideFunctionStackDepth === 1) {
        currentTopLevelFunctionNode = node;
        currentTopLevelFunctionReturns = false;
        currentTopLevelFunctionUsesModel = false;
        currentTopLevelFunctionHasRaised = false;
      }
    };

    const exitFunction = () => {
      insideFunctionStackDepth--;
      if (insideFunctionStackDepth === 0) {
        currentTopLevelFunctionNode = undefined;
        currentTopLevelFunctionReturns = undefined;
        currentTopLevelFunctionUsesModel = undefined;
        currentTopLevelFunctionHasRaised = undefined;
      }
    };

    const checkAndRaiseIssue = () => {
      if (
        currentTopLevelFunctionNode != null &&
        currentTopLevelFunctionReturns &&
        currentTopLevelFunctionUsesModel &&
        !currentTopLevelFunctionHasRaised
      ) {
        context.report({
          node: currentTopLevelFunctionNode,
          messageId: "returningValue",
        });
        currentTopLevelFunctionHasRaised = true;
      }
    };

    return {
      FunctionDeclaration(node: TSESTree.FunctionDeclaration) {
        enterFunction(node);
      },
      FunctionExpression(node: TSESTree.FunctionExpression) {
        enterFunction(node);
      },
      ArrowFunctionExpression(node: TSESTree.ArrowFunctionExpression) {
        enterFunction(node);
      },
      "FunctionDeclaration:exit"() {
        exitFunction();
      },
      "FunctionExpression:exit"() {
        exitFunction();
      },
      "ArrowFunctionExpression:exit"() {
        exitFunction();
      },

      ImportDeclaration(node: TSESTree.ImportDeclaration): void {
        if (
          node.source.type === AST_NODE_TYPES.Literal &&
          matchModel(node.source.value as string)
        ) {
          importsFromModel = true;
          const specifiers = node.specifiers;
          specifiers.forEach(specifier => {
            if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
              namedImportsFromModelNodes.push(specifier);
            } else if (
              specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier
            ) {
              modelImportNode = specifier;
            }
          });
        }
      },
      Identifier(node: TSESTree.Identifier): void {
        if (!importsFromModel || insideFunctionStackDepth === 0) {
          return;
        }
        if (
          modelImportNode &&
          identifierIsImported(node, modelImportNode, parserServices)
        ) {
          currentTopLevelFunctionUsesModel = true;
          checkAndRaiseIssue();
          return;
        }
        namedImportsFromModelNodes.forEach(specifiernode => {
          if (identifierIsImported(node, specifiernode, parserServices)) {
            currentTopLevelFunctionUsesModel = true;
            checkAndRaiseIssue();
          }
        });
      },
      ReturnStatement(): void {
        if (!importsFromModel || insideFunctionStackDepth !== 1) {
          return;
        }
        currentTopLevelFunctionReturns = true;
        checkAndRaiseIssue();
      },
    };
  },
};

export default rule;
