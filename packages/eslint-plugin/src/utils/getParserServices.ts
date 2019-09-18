import * as tsPluginUtil from "@typescript-eslint/eslint-plugin/dist/util";
import { ParserServices } from "@typescript-eslint/experimental-utils";
import { TSRuleContext } from "../types/rules";

export const getParserServices = (context: TSRuleContext): ParserServices => {
  const parserServices: ParserServices = tsPluginUtil.getParserServices(
    context,
  );
  if (!parserServices.program) {
    const filePath = context.parserOptions.filePath;
    throw Error(`Couldn't parse ${filePath}.`);
  }
  if (
    parserServices.esTreeNodeToTSNodeMap == null ||
    parserServices.tsNodeToESTreeNodeMap == null
  ) {
    throw Error(
      `Startup failed, please make sure you are using @typescript-eslint/parser.`,
    );
  }
  return parserServices;
};
