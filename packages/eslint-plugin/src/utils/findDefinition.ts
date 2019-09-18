import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { TSNode } from "@typescript-eslint/typescript-estree";

export const findDefinition = (
  identifierNode: TSESTree.Identifier,
  parserServices: ParserServices,
): TSESTree.Node | undefined => {
  const identifierTsNode = parserServices.esTreeNodeToTSNodeMap!.get<TSNode>(
    identifierNode,
  );
  const checker = parserServices.program!.getTypeChecker();
  let identifierSymbol = checker.getSymbolAtLocation(identifierTsNode);
  if (!identifierSymbol) {
    identifierSymbol = (identifierNode as any).symbol;
  }
  if (!identifierSymbol) {
    return;
  }
  const declarations = identifierSymbol.getDeclarations();
  let result: TSESTree.Node;
  if (declarations) {
    const lastDeclaration = declarations[declarations.length - 1];
    result = parserServices.tsNodeToESTreeNodeMap!.get(
      lastDeclaration as TSNode,
    );
    return result;
  }
};
