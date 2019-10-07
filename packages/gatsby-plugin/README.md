# @prodo/gatsby-plugin

A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for
[Prodo](https://github.com/prodo-ai/prodo) with
built-in server-side rendering support.

## Install

`npm install --save @prodo/core @prodo/babel-plugin @prodo/gatsby-plugin`

## How to use

Edit `gatsby-config.js`

```javascript
const path = require(`path`);

module.exports = {
  plugins: [
    {
      resolve: `@prodo/gatsby-plugin`,
      options: {
        model: path.join(__dirname, `path/to/model.js`), // absolute path to the model
        exportName: `model`, // optional name of the model export
        storeConfig: {
          // initial store configuration
          initState: {
            loadingUser: false,
          },
          initLocal: {
            user: null,
          },
        },
      },
    },
  ],
};
```

# Options

- `model` - String _required_: Absolute path to the file containing the Prodo model
- `exportName` - String _optional_: Name of the model export. Defaults to `model`. If the model is the default export, use `default`.
- `storeConfig` - Any: Object passed as an argument to `model.createStore()`.
