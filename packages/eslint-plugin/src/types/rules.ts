import { TSESTree } from "@typescript-eslint/experimental-utils";
import { AST, Linter, Rule, Scope, SourceCode } from "eslint";
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
    | ((node: TSESTree.ImportDeclaration) => void)
    | ((node: TSESTree.CallExpression) => void)
    | ((codePath: CodePath, node: TSESTree.Node) => void)
    | ((segment: CodePathSegment, node: TSESTree.Node) => void)
    | ((
        fromSegment: CodePathSegment,
        toSegment: CodePathSegment,
        node: TSESTree.Node,
      ) => void)
    | undefined;
}

export interface TSRuleModule {
  meta?: Rule.RuleMetaData;
  create(context: TSRuleContext): TSRuleListener;
}

export interface TSRuleContext {
  id: string;
  options: any[];
  settings: { [name: string]: any };
  parserPath: string;
  parserOptions: Linter.ParserOptions;
  parserServices: SourceCode.ParserServices;

  getAncestors(): TSESTree.Node[];

  getDeclaredVariables(node: TSESTree.Node): Scope.Variable[];

  getFilename(): string;

  getScope(): Scope.Scope;

  getSourceCode(): SourceCode;

  markVariableAsUsed(name: string): boolean;

  report(descriptor: TSReportDescriptor): void;
}

type TSReportDescriptor = ReportDescriptorMessage &
  ReportDescriptorLocation &
  ReportDescriptorOptions;
type ReportDescriptorMessage = { message: string } | { messageId: string };
type ReportDescriptorLocation =
  | { node: TSESTree.Node }
  | { loc: AST.SourceLocation | { line: number; column: number } };
interface ReportDescriptorOptions {
  data?: { [key: string]: string };

  fix?(fixer: Rule.RuleFixer): null | Rule.Fix | IterableIterator<Rule.Fix>;
}
