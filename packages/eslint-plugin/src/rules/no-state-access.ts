import { TSESTree } from "@typescript-eslint/typescript-estree";
import { TSRuleContext, TSRuleModule } from "../types/rules";
import { findDefinition } from "../utils/findDefinition";
import { identifierIsImportedFromModel } from "../utils/identifierIsImportedFromModel";

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
    return {
      "Identifier:not(:function Identifier, ImportDeclaration Identifier)"(
        node: TSESTree.Node,
      ): void {
        if (node.type !== "Identifier") {
          return;
        }
        const importNode = findDefinition(node, context);
        if (importNode && identifierIsImportedFromModel(importNode)) {
          if (
            importNode.type === "ImportSpecifier" &&
            importNode.imported.name === "state"
          ) {
            context.report({
              node,
              messageId: "accessingState",
              data: { name: node.name },
            });
          } else if (importNode.type === "ImportNamespaceSpecifier") {
            const parentNode = node.parent;
            if (
              parentNode &&
              parentNode.type === "MemberExpression" &&
              parentNode.property.type === "Identifier"
            ) {
              if (parentNode.property.name === "state") {
                context.report({
                  node: parentNode.property,
                  messageId: "accessingState",
                  data: {
                    name: (parentNode.property as TSESTree.Identifier).name,
                  },
                });
              }
            }
          }
        }
      },
    };
  },
};

export default rule;
