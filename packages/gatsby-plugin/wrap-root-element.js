import React from "react";

/**
 * so, this import is weird right?
 *
 * # What it looks like:
 * we're importing a webpack loader directly into our runtime bundle
 *
 * # What it's actually doing:
 * We configure the `model` loader in gatsby-node's
 * `onCreateWebpackConfig`. The configuration sets the loader to handle its
 * own file, so if we import `./loaders/model`, the `model`
 * loader handles loading itself.
 *
 * # Why does this work?
 * The loader doesn't use the file argument to itself and instead returns
 * a generated file that includes the `gatsby-config` model wrapped in
 * require() statements. This results in the `model` being required
 * and available to the code after this import.
 *
 * # Have a better solution to this?
 * Submit a PR
 */
import { Provider } from "./loaders/model";

const WrapRootElement = ({ element }) => <Provider>{element}</Provider>;

export default WrapRootElement;
