const path = require(`path`);

// Add Babel plugin
try {
  require.resolve(`@prodo/babel-plugin`);
} catch (e) {
  throw new Error(
    `'@prodo/babel-plugin' is not installed which is needed by plugin '@prodo/gatsby-plugin'`,
  );
}

exports.onCreateBabelConfig = ({ stage, actions }, pluginOptions) => {
  actions.setBabelPlugin({
    name: `@prodo/babel-plugin`,
    stage,
  });
};

exports.onCreateWebpackConfig = (
  { stage, loaders, actions, plugins, cache, ...other },
  pluginOptions,
) => {
  const ssr =
    stage === `build-html` || stage === `build-javascript` || `develop-html`;

  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /model\.js$/,
          include: path.dirname(require.resolve(`@prodo/gatsby-plugin`)),
          use: [
            loaders.js(),
            {
              loader: path.join(`@prodo/gatsby-plugin`, `loaders`, `model`),
              options: {
                ssr,
                ...pluginOptions,
              },
            },
          ],
        },
      ],
    },
  });
};
