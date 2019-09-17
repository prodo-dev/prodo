# Prodo ESLint Plugin

[Prodo](https://prodo.dev) plugin for [ESLint](https://eslint.org/).

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `@prodo/eslint-plugin`:

```
$ npm install @prodo/eslint-plugin --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `@prodo/eslint-plugin` globally.

## Usage

Add `@prodo/eslint-plugin` to the plugins section of your `.eslintrc` configuration file.prefix:

```json
{
  "plugins": ["@prodo/eslint-plugin"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "@prodo/eslint-plugin/rule-name": 2
  }
}
```
