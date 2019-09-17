import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { TSNode } from "@typescript-eslint/typescript-estree";

export const identifierIsImported = (
  identifierNode: TSESTree.Identifier,
  importSpecifierNode:
    | TSESTree.ImportSpecifier
    | TSESTree.ImportNamespaceSpecifier,
  parserServices: ParserServices,
): boolean => {
  const specifierTsNode = parserServices.esTreeNodeToTSNodeMap!.get<TSNode>(
    importSpecifierNode,
  );
  const identifierTsNode = parserServices.esTreeNodeToTSNodeMap!.get<TSNode>(
    identifierNode,
  );
  const checker = parserServices.program!.getTypeChecker();
  let specifierSymbol = checker.getSymbolAtLocation(specifierTsNode);
  let identifierSymbol = checker.getSymbolAtLocation(identifierTsNode);
  if (!specifierSymbol) {
    specifierSymbol = (specifierTsNode as any).symbol;
  }
  if (!identifierSymbol) {
    identifierSymbol = (identifierNode as any).symbol;
  }
  if (!(specifierSymbol && identifierSymbol)) {
    return false;
  }
  if (specifierSymbol && identifierSymbol) {
    const declarations = identifierSymbol!.getDeclarations();
    if (
      declarations &&
      declarations[declarations.length - 1].pos === specifierTsNode.pos
    ) {
      return specifierSymbol === identifierSymbol;
    }
  }
  return false;
};
