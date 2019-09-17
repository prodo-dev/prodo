import * as ts from "@typescript-eslint/eslint-plugin";
import * as tsPluginUtil from "@typescript-eslint/eslint-plugin/dist/util";
import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { TSNode } from "@typescript-eslint/typescript-estree";
import { TSRuleContext, TSRuleModule } from "../types/rules";
import { identifierIsImported } from "../utils/matchIdentifierToImport";
import { nameImportedFromModel } from "../utils/nameIsImportedFromModel";

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
    let dispatchImportNode: ts.ImportSpecifier;
    let modelImportNode: ts.ImportNamespaceSpecifier;
    const parserServices: ParserServices = tsPluginUtil.getParserServices(
      context,
    );

    return {
      ImportDeclaration: (node: TSESTree.ImportDeclaration): void => {
        const result = nameImportedFromModel(node, parserServices, "dispatch");
        dispatchImportNode = result.namedImportNode;
        modelImportNode = result.modelImportNode;
        importsDispatchFromModel =
          dispatchImportNode != null || modelImportNode != null;
      },
      CallExpression: (node: TSESTree.CallExpression): void => {
        if (
          !(
            importsDispatchFromModel &&
            node &&
            node.parent &&
            node.parent.type !== "CallExpression"
          )
        ) {
          return;
        }
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "dispatch"
        ) {
          if (
            dispatchImportNode &&
            identifierIsImported(
              node.callee,
              dispatchImportNode,
              parserServices,
            )
          ) {
            context.report({
              node,
              messageId: "mustBeCalled",
              data: { name: (node.callee as TSESTree.Identifier).name },
            });
          }
        } else if (node.callee.type === "MemberExpression") {
          const propertyTSNode = parserServices.esTreeNodeToTSNodeMap!.get<
            TSNode
          >(node.callee.property);
          if (propertyTSNode.getFullText() === "dispatch") {
            context.report({
              node,
              messageId: "mustBeCalled",
              data: {
                name: (node.callee.property as TSESTree.Identifier).name,
              },
            });
          }
        }
      },
    };
  },
};

export default rule;
