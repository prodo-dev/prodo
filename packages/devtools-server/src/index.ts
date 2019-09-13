import * as path from "path";
import { createBundler } from "./bundler";
import { createBundlerServer, createStaticServer } from "./server";

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
