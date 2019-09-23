import { TSESTree } from "@typescript-eslint/typescript-estree";
import { TSRuleContext } from "../types/rules";

export const findDefinition = (
  identifierNode: TSESTree.Identifier,
  context: TSRuleContext,
): TSESTree.Node | undefined => {
  const scope = context.getScope();
  const references = scope.references;
  const reference = references.find(
    ref => ref.identifier.name === identifierNode.name,
  );
  if (reference) {
    const resolved = reference.resolved;
    if (resolved) {
      return resolved.defs[resolved.defs.length - 1].node;
    }
  }
  return undefined;
};
