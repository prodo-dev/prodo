import * as path from "path-browserify";
import { Dependencies, Typings } from "../types";

const ctx = (self as any) as Worker;

interface MessageData {
  dependencies: Dependencies;
}

// Cached typings code that we have already loaded
const loadedTypings: Typings = {};

const jsDeliverUrl = `https://cdn.jsdelivr.net`;

const resolvePackageVersion = async (
  name: string,
  version: string,
): Promise<string> =>
  fetch(`https://data.jsdelivr.com/v1/package/resolve/npm/${name}@${version}`)
    .then(res => res.json())
    .then(json => json.version);

const getNpmPackageFile = (
  name: string,
  version: string,
  filename: string,
): Promise<string> =>
  fetch(`${jsDeliverUrl}/npm/${name}@${version}/${filename}`).then(res =>
    res.text(),
  );

const getPackageJson = (name: string, version: string) =>
  getNpmPackageFile(name, version, "package.json").then(res => JSON.parse(res));

const getTypesFromPackageJson = async (
  name: string,
  version: string,
  typings: Typings,
) => {
  const packageJson = await getPackageJson(name, version);
  const types = packageJson.typings || packageJson.types;

  if (types) {
    typings[`node_modules/${name}/package.json`] = JSON.stringify(packageJson);

    const filename = path.resolve("/", types);
    const typesFile = await getNpmPackageFile(name, version, filename);
    typings[`node_modules/${name}${filename}`] = typesFile;
  } else {
    throw new Error("cannot get type from package.json");
  }
};

const getTypesFromDefinitelyTyped = (name: string, typings: Typings) =>
  fetch(
    `${jsDeliverUrl}/npm/@types/${name
      .replace("@", "")
      .replace(/\//g, "__")}/index.d.ts`,
  )
    .then(res => res.text())
    .then(text => {
      typings[`node_modules/@types/${name}/index.d.ts`] = text;
    });

const getDependencies = async (
  dependencies: Dependencies,
): Promise<Typings> => {
  const packageNames = Object.keys(dependencies);

  const typings: Typings = {};

  await Promise.all(
    packageNames.map(async name => {
      try {
        if (loadedTypings[name]) {
          // Get typings from cache
          return loadedTypings[name];
        }

        const depVersion = await resolvePackageVersion(
          name,
          dependencies[name],
        );

        await getTypesFromPackageJson(name, depVersion, typings).catch(() =>
          getTypesFromDefinitelyTyped(name, typings),
        );
      } catch (e) {
        // tslint:disable-next-line: no-console
        console.error(`Error fetching types for ${name}.\n`, e);
      }
    }),
  );

  return typings;
};

ctx.addEventListener("message", async event => {
  const data = event.data as MessageData;
  const typings = await getDependencies(data.dependencies);

  ctx.postMessage(typings);
});
