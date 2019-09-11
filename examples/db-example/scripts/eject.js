const plugin = require("@prodo/babel-plugin");
const ts = require("@babel/plugin-syntax-typescript");
const babel = require("@babel/core");
const prettier = require("prettier");
const { glob } = require("glob");
const mkdirp = require("mkdirp");
const fs = require("fs");

const DIR = "./src-transpiled";
mkdirp(DIR, e => {
  if (e) throw e;
  glob("./src/**/*", (e, files) => {
    if (e) throw e;
    files.forEach(file => {
      fs.readFile(file, "utf8", (e, code) => {
        if (e) throw e;
        const path = file.replace(/^\.\/src/g, DIR);
        const transpiled = /\.[j|t]sx?$/.test(file)
          ? prettier.format(
              babel.transform(code, {
                plugins: [[ts, { isTSX: true }], plugin],
              }).code,
              { parser: "typescript" },
            )
          : code;
        fs.writeFile(path, transpiled, e => {
          if (e) throw e;
        });
      });
    });
  });
});
