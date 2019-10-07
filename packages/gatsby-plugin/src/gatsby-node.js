const path = require(`path`);

// Add Babel plugin
try {
  require.resolve(`@prodo/babel-plugin`);
} catch (e) {
  throw new Error(
    `'@prodo/babel-plugin' is not installed which is needed by plugin 'gatsby-plugin-prodo'`,
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
          include: path.dirname(require.resolve(`gatsby-plugin-prodo`)),
          use: [
            loaders.js(),
            {
              loader: path.join(`gatsby-plugin-prodo`, `loaders`, `model`),
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
