import { TSESTree } from "@typescript-eslint/typescript-estree";
import { TSRuleContext } from "../types/rules";
import { findDefinition } from "./findDefinition";

const matchModel = (name: string) =>
  name.startsWith(".") && /model(\.ctx)?(\.(j|t)sx?)?$/.test(name);

export const identifierIsImportedFromModel = (
  identifierNode: TSESTree.Identifier,
  context: TSRuleContext,
): TSESTree.ImportNamespaceSpecifier | TSESTree.ImportSpecifier | undefined => {
  const declarationIdentifierNode = findDefinition(identifierNode, context);
  if (
    declarationIdentifierNode &&
    (declarationIdentifierNode.type === "ImportNamespaceSpecifier" ||
      declarationIdentifierNode.type === "ImportSpecifier") &&
    declarationIdentifierNode.parent &&
    declarationIdentifierNode.parent.type === "ImportDeclaration" &&
    declarationIdentifierNode.parent.source.type === "Literal" &&
    matchModel(declarationIdentifierNode.parent.source.value as string)
  ) {
    return declarationIdentifierNode;
  }
};
