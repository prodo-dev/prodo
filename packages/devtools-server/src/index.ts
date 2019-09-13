import * as Express from "express";
import * as http from "http";
import * as Bundler from "parcel-bundler";
import * as path from "path";

const createBundler = async (entryFiles: string[], outputDirectory: string) => {
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

const createBundlerServer = async (
  entryFile: string,
  outDir: string,
  port: number,
): Promise<any> => {
  const app = Express();
  app.use(Express.static(outDir));
  app.get("/*", async (_request: any, response: any) => {
    response.sendFile(entryFile);
  });

  const httpServer = new http.Server(app);
  await new Promise(resolve => httpServer.listen(port, resolve));

  return {
    port,
    server: httpServer,
  };
};

const createStaticServer = async (
  entryFile: string,
  port: number,
): Promise<any> => {
  const dir = path.dirname(entryFile);

  const app = Express();
  app.use(Express.static(dir));
  app.get("/*", async (_request, response) => {
    response.sendFile(entryFile);
  });

  const httpServer = new http.Server(app);
  await new Promise(resolve => httpServer.listen(port, resolve));

  return {
    port,
    server: httpServer,
  };
};

// Serve user app on port 1234
// Serve devtools with user app in iframe on port 1235
const startServers = async () => {
  const appServerPort = 1234;
  const devServerPort = 1235;

  // const appPath = path.join(
  //   path.dirname(path.dirname(require.resolve("@prodo-example/todo-app"))),
  //   "lib",
  // );
  const appPath = path.join("../../examples/todo-app", "dist");
  const entryFiles = [path.join(appPath, "index.html")];
  const outputDirectory = path.join("dist", "userApp");

  const bundler = await createBundler(entryFiles, outputDirectory);
  const bundle = await bundler.bundle();

  const [[devFile], [appFile]] = [
    [require.resolve("@prodo/devtools-core/dist/index.html")],
    [bundle.name],
  ];

  await createBundlerServer(appFile, outputDirectory, appServerPort);
  await createStaticServer(devFile, devServerPort);
};

startServers();
