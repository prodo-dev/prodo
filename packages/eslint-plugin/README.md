# eslint-plugin-prodo

prodo plugin for eslint

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-prodo`:

```
$ npm install eslint-plugin-prodo --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-prodo` globally.

## Usage

Add `prodo` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "prodo"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "prodo/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





