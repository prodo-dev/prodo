import { TSESTree } from "@typescript-eslint/experimental-utils";
import { Rule } from "eslint";

type CodePath = Rule.CodePath;
type CodePathSegment = Rule.CodePathSegment;

interface TSRuleListener {
  onCodePathStart?(codePath: CodePath, node: TSESTree.Node): void;

  onCodePathEnd?(codePath: CodePath, node: TSESTree.Node): void;

  onCodePathSegmentStart?(segment: CodePathSegment, node: TSESTree.Node): void;

  onCodePathSegmentEnd?(segment: CodePathSegment, node: TSESTree.Node): void;

  onCodePathSegmentLoop?(
    fromSegment: CodePathSegment,
    toSegment: CodePathSegment,
    node: TSESTree.Node,
  ): void;

  [key: string]:
    | ((codePath: CodePath, node: TSESTree.Node) => void)
    | ((segment: CodePathSegment, node: TSESTree.Node) => void)
    | ((
        fromSegment: CodePathSegment,
        toSegment: CodePathSegment,
        node: TSESTree.Node,
      ) => void)
    | ((node: TSESTree.Node) => void)
    | undefined;
}

export interface TSRuleModule {
  meta?: Rule.RuleMetaData;
  create(context: Rule.RuleContext): TSRuleListener;
}
