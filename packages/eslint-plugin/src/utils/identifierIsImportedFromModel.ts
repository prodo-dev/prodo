import { TSESTree } from "@typescript-eslint/typescript-estree";

const matchModel = (name: string) =>
  name.startsWith(".") && /model(\.ctx)?(\.(j|t)sx?)?$/.test(name);

export const identifierIsImportedFromModel = (
  declarationIdentifierNode: TSESTree.Node,
) => {
  if (
    declarationIdentifierNode &&
    (declarationIdentifierNode.type === "ImportNamespaceSpecifier" ||
      declarationIdentifierNode.type === "ImportSpecifier") &&
    declarationIdentifierNode.parent &&
    declarationIdentifierNode.parent.type === "ImportDeclaration" &&
    declarationIdentifierNode.parent.source.type === "Literal" &&
    matchModel(declarationIdentifierNode.parent.source.value as string)
  ) {
    return true;
  }
  return false;
};
