---
title: "Eslint Plugin"
order: 8
experimental: true
---

_Note: The eslint plugin only works when using the `@typescript-eslint/parser`._

# Installation

First, you'll need to install [ESLint](http://eslint.org) and necessary eslint
plugins and parsers:

```shell
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Finally, install `@prodo/eslint-plugin`:

```shell
npm install @prodo/eslint-plugin --save-dev
```

# Usage

If you already have an eslint configuration, add all the above plugins to the
plugins section and set the parser option to `@typescript-eslint/parser`.

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript/eslint-plugin", "@prodo/eslint-plugin"]
}
```

Next need to specify the eslint [rules](#rules) or use the
[recommended](#recommended) configuration.

# Recommended

We recommend extending the `plugin:@prodo/recommended` and `plugin:@typescript-eslint/eslint-recommended` configurations.

```json
{
  "extends": [
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
Eslint does not conflict with Prettier, you can use `eslint-config-prettier`.

```shell
npm install --save-dev eslint-config-prettier
```

```json
{
  "extends": ["prettier", "prettier/@typescript-eslint", "prettier/react"]
}
```

## Full Configuration

Following the above recommendations, a full Eslint configuration can be found below:

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
