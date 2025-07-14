import path from "path";
import fs from "fs";

import { ArgParser } from "./lib/arg-parser";
import { Installation } from "./installation";
import { ConfigFiles } from "./config-files";
import logging, { type Logger } from "./lib/logging";
let logger: Logger;

type SupportedPackageManager = "npm" | "yarn" | "pnpm";

function isPathLike(name: string): boolean {
  if (name.startsWith("./")) return true;
  if (name.startsWith("../")) return true;
  if (name.startsWith("/")) return true;
  if (name.startsWith("\\")) return true;
  if (name.includes("/")) return true;
  if (name.includes("\\")) return true;

  const windowsDrivePattern = /^[a-zA-Z]:[\\/]/;
  if (windowsDrivePattern.test(name)) return true;

  return false;
}

function main(name: string, packageManager: SupportedPackageManager) {
  let projectName = name;
  if (isPathLike(name)) {
    projectName = path.basename(name);
  }
  const projectRoot = path.resolve(process.cwd(), name);
  if (fs.existsSync(projectRoot)) {
    logger.error(`Project directory ${projectRoot} already exists.`);
    return;
  }

  const installation = new Installation();
  installation.recommended();

  const configFiles = new ConfigFiles(
    installation.getFlags(),
    projectRoot,
    projectName,
  );
  configFiles.parseFlags("readme", "gitignore").write();

  installation.runInstall(packageManager, projectRoot);
  logger.info(`Project ${projectName} setup complete.`);
  logger.info(
    `Run 'cd ${projectName}' to enter the project directory and start working.`,
  );
  logger.info(`Run '${packageManager} run dev' to start dev.`);
}

type Args = {
  debug: boolean;
  name: string;
  config?: string;
  npm?: boolean;
  yarn?: boolean;
  pnpm?: boolean;
};
function CLI() {
  const parser = new ArgParser(
    "TS Scaffold",
    "A CLI scaffold that allows you to quickly build your own TypeScript project with many usefull tools.",
  );

  parser.addArg({
    flag: "--debug",
    action: "store-bool",
    required: false,
    type: "bool",
    description: "Enable debug mode",
    default: false,
  });
  parser.addArg({
    flag: "--name",
    shortFlag: "-n",
    action: "store",
    required: true,
    type: "str",
    description: "The name of the project",
  });
  parser.addArg({
    flag: "--npm",
    action: "store-bool",
    required: false,
    type: "bool",
    default: false,
    description: "Use npm as the package manager",
  });
  parser.addArg({
    flag: "--yarn",
    action: "store-bool",
    required: false,
    type: "bool",
    default: false,
    description: "Use yarn as the package manager",
  });
  parser.addArg({
    flag: "--pnpm",
    action: "store-bool",
    required: false,
    type: "bool",
    default: false,
    description: "Use pnpm as the package manager",
  });
  parser.addArg({
    flag: "--config",
    shortFlag: "-c",
    action: "store",
    required: false,
    type: "str",
    description: "The path to the configuration file",
  });

  const args = parser.parse<Args>();
  const { debug, name, config, npm, yarn, pnpm } = args;

  if (debug) {
    logger = logging.getLogger("global", { level: "debug" });
    logging.setGlobalLevel("debug");
  } else {
    logger = logging.getLogger("global");
  }

  let packageManager: SupportedPackageManager;
  if (!npm && !yarn && !pnpm) {
    logger.warn("No package manager specified. Defaulting to npm.");
    packageManager = "npm";
  } else if (npm) {
    logger.info("Using npm as the package manager.");
    packageManager = "npm";
  } else if (yarn) {
    logger.info("Using yarn as the package manager.");
    packageManager = "yarn";
  } else if (pnpm) {
    logger.info("Using pnpm as the package manager.");
    packageManager = "pnpm";
  } else {
    logger.error(
      "Invalid package manager specified. Use --npm, --yarn, or --pnpm.",
    );
    throw new Error("Invalid package manager specified.");
  }

  if (config) {
    logger.error("Config file is not supported yet.");
    return;
  }

  main(name, packageManager);
}

CLI();
