import * as path from "path";
import { createBundler } from "./bundler";
import {
  createBundlerServer,
  createStaticServer,
  findFreePort,
} from "./server";

const startServers = async () => {
  const appServerPort = await findFreePort(1234);
  const devServerPort = await findFreePort(appServerPort + 1);

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
  // tslint:disable-next-line:no-console
  console.log("appServerPort", appServerPort);

  await createStaticServer(devFile, devServerPort);
  // tslint:disable-next-line:no-console
  console.log("devServerPort", devServerPort);
};

startServers();
