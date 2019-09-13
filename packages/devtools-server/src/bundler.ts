import * as Bundler from "parcel-bundler";

export const createBundler = async (
  entryFiles: string[],
  outputDirectory: string,
) => {
  const options = {
    outDir: outputDirectory,
    watch: true,
    cache: true,
    minify: false,
    scopeHoist: false,
    hmr: true,
    hmrPort: 0,
    detailedReport: false,
    bundleNodeModules: true,
    logLevel: 1 as 1, // errors only,
  };
  return new Bundler(entryFiles, options);
};
