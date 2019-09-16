import { format, getFormatType } from "./format";
import theme from "./themes";

export const configureMonaco = () => {
  const compilerOptions = {
    allowJs: true,
    allowNonTsExtensions: true,
    allowSyntheticDefaultImports: true,
    alwaysStrict: true,
    jsx: "react",
    jsxFactory: "React.createElement",
    typeRoots: ["node_modules/@types"],
    noEmit: true,
  };

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
    compilerOptions as any,
  );
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
    compilerOptions as any,
  );

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  const formatWithPrettier = {
    async provideDocumentFormattingEdits(model: monaco.editor.IModel) {
      const text = await format(
        model.getValue(),
        getFormatType(model.uri.path),
      );

      return [{ range: model.getFullModelRange(), text }];
    },
  };

  monaco.languages.registerDocumentFormattingEditProvider(
    "typescript",
    formatWithPrettier,
  );
  monaco.languages.registerDocumentFormattingEditProvider(
    "javascript",
    formatWithPrettier,
  );
  monaco.languages.registerDocumentFormattingEditProvider(
    "json",
    formatWithPrettier,
  );

  /**
   * Sync all the models to the worker eagerly.
   * This enables intelliSense for all files without needing an `addExtraLib` call.
   */
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

  monaco.languages.typescript.typescriptDefaults.setMaximumWorkerIdleTime(-1);
  monaco.languages.typescript.javascriptDefaults.setMaximumWorkerIdleTime(-1);

  monaco.editor.defineTheme("prodo", theme);
};
