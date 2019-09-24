import chalk from "chalk";
import * as commander from "commander";
import * as downloadGitRepo from "download-git-repo";
import * as fs from "fs";
import * as path from "path";
import * as tildePath from "tilde-path";
import * as validateNpmPackageName from "validate-npm-package-name";
import logger, { VerbosityLevel } from "./logger";
import * as childProcess from "child_process";

const execSync = childProcess.execSync;

// tslint:disable-next-line:no-var-requires
const packageJson = require("../package.json");

const typescriptTemplate = "github:prodo-ai/prodo-template";
const javascriptTemplate = "github:prodo-ai/prodo-template-js";

let projectName: string | null = null;

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments("<project-directory>")
  .usage(`${chalk.green("<project-directory>")} [options]`)
  .action(name => {
    projectName = name;
  })
  .on("--help", () => {
    logger.log();
    logger.log(`    Only ${chalk.green("<project-directory>")} is required.`);
    logger.log();
  })
  .option("--typescript", "Create project with TypeScript")
  .option("--verbose", "Show more logging information")
  .parse(process.argv);

if (program.verbose) {
  logger.setVerbosity(VerbosityLevel.debug);
}

if (projectName == null) {
  logger.log("Please specify the project directory:");
  logger.log();
  logger.log("For example:");
  logger.log(`  ${chalk.cyan(program.name())} ${chalk.green("my-prodo-app")}`);
  logger.log();
  logger.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`,
  );
  process.exit(1);
}

const shouldUseYarn = () => {
  try {
    execSync("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
};

const downloadRepo = (template: string, dest: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    downloadGitRepo(template, dest, (err: any) => {
      err == null ? resolve() : reject(err);
    });
  });

const printSuccessMessage = (name: string, root: string) => {
  const useYarn = shouldUseYarn();

  const installCommand = useYarn ? "yarn" : "npm install";
  const startCommand = useYarn ? "yarn start" : "npm start";

  logger.log(`Success! 🎉`);
  logger.log(`Created ${name} at ${tildePath(root)}`);
  logger.log();
  logger.log("Start your app with");
  logger.log();
  logger.log(`    ${chalk.cyan("cd")} ${name}`);
  logger.log(`    ${chalk.cyan(installCommand)}`);
  logger.log(`    ${chalk.cyan(startCommand)}`);
  logger.log();
};

// remove references to prodo-template-* in newly created apps package.json
const cleanupPackageJson = (name: string, root: string) => {
  const filename = path.resolve(root, "package.json");
  const userPackageJson = require(filename);

  userPackageJson.name = name;
  userPackageJson.version = "0.1.0";
  delete userPackageJson.repository;

  fs.writeFileSync(filename, JSON.stringify(userPackageJson, null, 2));
};

// delete files in newly created app that are not needed
const cleanupRepo = (root: string) => {
  const filesToDelete = ["yarn.lock", "package-lock.json"];

  filesToDelete.forEach(file => {
    try {
      fs.unlinkSync(path.resolve(root, file));
    } catch (_e) {
      // do nothing
    }
  });
};

const createApp = async (name: string, useTypescript: boolean) => {
  const root = path.resolve(name);

  // validate project name
  const validResult = validateNpmPackageName(name);
  if (!validResult.validForNewPackages) {
    logger.log();
    logger.log(`${name} is an invalid package name`);
    (validResult.warnings || []).forEach(s =>
      logger.log("  " + chalk.yellow(s)),
    );
    (validResult.errors || []).forEach(s => logger.log("  " + chalk.red(s)));
    logger.log();
    process.exit(1);
  }

  // check directory is empty
  if (fs.existsSync(root)) {
    logger.log();
    logger.log(`Cannot create app in existing directory`);
    logger.log(`    ${chalk.magenta(tildePath(root))}`);
    logger.log();
    process.exit(1);
  }

  // download template repo
  const template = useTypescript ? typescriptTemplate : javascriptTemplate;
  try {
    await downloadRepo(template, root);
  } catch (e) {
    logger.log(chalk.red("Error downloading template repo."));
    process.exit(1);
  }

  cleanupPackageJson(name, root);
  cleanupRepo(root);

  printSuccessMessage(name, root);
};

createApp(projectName!, program.typescript);
