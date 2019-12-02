---
title: "ESlint Plugin"
order: 8
experimental: true
---

# Installation

First, install [ESLint](http://eslint.org) and `@prodo/eslint-plugin`:

```shell
npm install @prodo/eslint-plugin --save-dev
```

If you are using TypeScript, you'll also need to install the TypeScript ESLint
plugin and parser.

```shell
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

# Usage

If you already have an ESLint configuration, add the Prodo plugin to the plugins
section.

```json
{
  "plugins": ["@prodo/eslint-plugin"]
}
```

If you are using TypeScript, you will need to change the parser to the
[TypeScript ESLint parser](https://www.npmjs.com/package/@typescript-eslint/parser).

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript/eslint-plugin", "@prodo/eslint-plugin"]
}
```

If you are using JavaScript, you will need to change the parser to the [Babel
ESLint parser](https://github.com/babel/babel-eslint).

```json
{
  "parser": "babel-eslint",
  "plugins": ["@prodo/eslint-plugin"]
}
```

Next you need to specify the eslint [rules](#rules) or use the
[recommended](#recommended) configuration.

# Recommended

We recommend extending the `eslint:recommended` and `plugin:@prodo/recommended` configuration.

```json
{
  "extends": ["eslint:recommended", "plugin:@prodo/recommended"]
}
```

If you are using TypeScript we also recommended extending the
`plugin:@typescript-eslint/eslint-recommended` configuration.

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended"
    "plugin:@prodo/recommended",
  ]
}
```

## Using React

If you are using React, we also recommend installing `eslint-plugin-react` and
configuring it.

```shell
npm install --save-dev eslint-plugin-react
```

```json
{
  "extends": ["plugin:react/recommended"],
  "env": {
    "browser": true,
    "es6": true
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": ["react"]
}
```

## Using Prettier

[Prettier](https://prettier.io/) is a commonly used code formatter. To ensure
ESLint does not conflict with Prettier, you can use `eslint-config-prettier`.

```shell
npm install --save-dev eslint-config-prettier
```

```json
{
  "extends": ["prettier", "prettier/react"]
}
```

If you are using TypeScript

```json
{
  "extends": ["prettier", "prettier/@typescript-eslint", "prettier/react"]
}
```

## Full Configuration

Following the above recommendations, a full ESLint configuration for TypeScript
can be found below (remove references to TypeScript for a JavaScript version):

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react"
  ],
  "env": {
    "browser": true,
    "es6": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint"]
}
```

# Rules

## `@prodo/no-state-access`

Prevents you from accessing state outside components or actions.

## `@prodo/require-dispatched-action-is-called`

Requires that call the result of `dispatch` immediately.
