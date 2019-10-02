# Prodo ESLint Plugin

[Prodo](https://prodo.dev) plugin for [ESLint](https://eslint.org/).

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm install eslint --save-dev
```

Next install the typescript eslint parser:

```
$ npm install @typescript-eslint/parser --save-dev
```

Finally, install `@prodo/eslint-plugin`:

```
$ npm install @prodo/eslint-plugin --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must
also install `@prodo/eslint-plugin` globally.

## Usage

Add `@prodo/eslint-plugin` to the plugins section of your `.eslintrc`
configuration, and set the parser option to `@typescript-eslint/parser`:

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@prodo/eslint-plugin"]
}
```

It is recomended that you also use the [typescript-eslint
plugin](https://github.com/typescript-eslint/typescript-eslint).

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "@prodo/rule-name": 2
  }
}
```
