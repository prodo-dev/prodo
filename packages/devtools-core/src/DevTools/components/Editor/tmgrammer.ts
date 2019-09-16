import { wireTmGrammars } from "monaco-editor-textmate";
import { Registry } from "monaco-textmate";
import { loadWASM } from "onigasm";

const tsGrammar = "/grammars/tsGrammar.tmLanguage";
const cssGrammar = "/grammars/cssGrammar.json.tmLanguage";
const htmlGrammar = "/grammars/htmlGrammar.json.tmLanguage";
const jsonGrammar = "/grammars/json.tmLanguage";

export const setupGrammars = async () => {
  // See https://www.npmjs.com/package/onigasm#light-it-up
  await loadWASM("https://unpkg.com/onigasm@2.2.2/lib/onigasm.wasm");

  const registry = new Registry({
    getGrammarDefinition: async scopeName => {
      const getContent = async (path: string) =>
        fetch(path).then(res => res.text());

      if (scopeName === "source.css") {
        return {
          format: "json",
          content: await getContent(cssGrammar),
        };
      } else if (scopeName === "text.html.basic") {
        return {
          format: "json",
          content: await getContent(htmlGrammar),
        };
      } else if (scopeName === "source.json") {
        return {
          format: "plist",
          content: await getContent(jsonGrammar),
        };
      }

      return {
        format: "plist",
        content: await getContent(tsGrammar),
      };
    },
  });

  // map of monaco "language id's" to TextMate scopeNames
  const grammars = new Map<string, string>();
  grammars.set("css", "source.css");
  grammars.set("html", "text.html.basic");
  grammars.set("typescript", "source.tsx");
  grammars.set("json", "source.json");

  await wireTmGrammars(monaco, registry, grammars);
};
