const loaderUtils = require(`loader-utils`);

/**
 * loads a generated file that allows us to require the model.
 * this is useful because otherwise requiring the model in
 * gatsby-ssr/browser results in a webpack require context warning
 *
 * results in a file that looks like:
 *
 * ```js
 * const model = require('path/to/model').model
 * module.exports = model.createStore(storeConfig)
 * ```
 */
module.exports = function() {
  const options = loaderUtils.getOptions(this);
  const storeConfig = { ...(options.storeConfig || {}) };

  // in SSR, we need a localFixture (because localStorage doesn't exist)
  if (options.ssr && !storeConfig.localFixture) {
    storeConfig.localFixture = storeConfig.initLocal || {};
  }

  return `const model = require('${options.model}')${
    options.exportName === `default` ? `` : `.${options.exportName || "model"}`
  }
module.exports = model.createStore(${JSON.stringify(storeConfig)})
`;
};
