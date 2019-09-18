import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { findDefinition } from "./findDefinition";

const matchModel = (name: string) =>
  name.startsWith(".") && /model(\.ctx)?(\.(j|t)sx?)?$/.test(name);

export const identifierIsImportedFromModel = (
  identifierNode: TSESTree.Identifier,
  parserServices: ParserServices,
): TSESTree.ImportNamespaceSpecifier | TSESTree.ImportSpecifier | undefined => {
  const declarationIdentifierNode = findDefinition(
    identifierNode,
    parserServices,
  );
  if (
    declarationIdentifierNode &&
    (declarationIdentifierNode.type ===
      AST_NODE_TYPES.ImportNamespaceSpecifier ||
      declarationIdentifierNode.type === AST_NODE_TYPES.ImportSpecifier) &&
    declarationIdentifierNode.parent &&
    declarationIdentifierNode.parent.type ===
      AST_NODE_TYPES.ImportDeclaration &&
    declarationIdentifierNode.parent.source.type === AST_NODE_TYPES.Literal &&
    matchModel(declarationIdentifierNode.parent.source.value as string)
  ) {
    return declarationIdentifierNode;
  }
};
