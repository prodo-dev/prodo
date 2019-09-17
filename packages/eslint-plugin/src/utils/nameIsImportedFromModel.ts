import {
  ParserServices,
  TSESTree,
} from "@typescript-eslint/experimental-utils";
import { AST_NODE_TYPES, TSNode } from "@typescript-eslint/typescript-estree";

const matchModel = (name: string) =>
  name.startsWith(".") && /model(\.ctx)?(\.(j|t)sx?)?$/.test(name);

export const nameImportedFromModel = (
  node: TSESTree.ImportDeclaration,
  parserServices: ParserServices,
  name: string,
): {
  namedImportNode: TSESTree.ImportSpecifier | undefined;
  modelImportNode: TSESTree.ImportNamespaceSpecifier | undefined;
} => {
  let namedImportNode: TSESTree.ImportSpecifier | undefined;
  let modelImportNode: TSESTree.ImportNamespaceSpecifier | undefined;
  const specifiers = node.specifiers;
  if (node.source.type === AST_NODE_TYPES.Literal) {
    if (matchModel(node.source.value as string)) {
      specifiers.forEach(specifier => {
        if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
          const specifierTsNode = parserServices.esTreeNodeToTSNodeMap!.get<
            TSNode
          >(specifier);
          if (specifierTsNode.getFullText() === name) {
            namedImportNode = specifier;
          }
        } else if (specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier) {
          modelImportNode = specifier;
        }
      });
    }
  }
  return { namedImportNode, modelImportNode };
};
