import { spawnSync } from "child_process";

import logging from "@/lib/logging";
const logger = logging.getLogger("global");

export const ConfigFlags = [
  "nodejs",
  "eslint",
  "eslint-tsconfig",
  "prettier",
  "vitest",
] as const;
export type ConfigFlag = (typeof ConfigFlags)[number];

export class Installation {
  _dependencies: Set<string> = new Set();
  _devDependencies: Set<string> = new Set();
  _flags: Set<ConfigFlag> = new Set();

  constructor() {
    this._devDependencies.add("typescript");
  }

  getFlags(): Set<ConfigFlag> {
    return this._flags;
  }

  recommended(): this {
    logger.debug("Adding recommended dependencies and flags");
    return this.withESLint()
      .withPrettier()
      .withESLintTSConfig()
      .withTsup()
      .withTsx()
      .withVitest();
  }

  withNodeJS(): this {
    this._devDependencies.add("@types/node");
    this._flags.add("nodejs");
    return this;
  }

  withESLint(): this {
    this._devDependencies.add("eslint");
    if (this._devDependencies.has("prettier")) {
      this.withESLintPrettier();
    }
    this._flags.add("eslint");
    return this;
  }

  // Enable eslint.config.ts support
  withESLintTSConfig(): this {
    this._devDependencies.add("jiti");
    this._flags.add("eslint-tsconfig");
    return this;
  }

  withPrettier(): this {
    this._devDependencies.add("prettier");
    if (this._devDependencies.has("eslint")) {
      this.withESLintPrettier();
    }
    this._flags.add("prettier");
    return this;
  }

  withESLintPrettier(): this {
    this._devDependencies.add("eslint-config-prettier");
    this._devDependencies.add("eslint-plugin-prettier");
    return this;
  }

  withTsup(): this {
    this._devDependencies.add("tsup");
    return this;
  }

  withTsx(): this {
    this._devDependencies.add("tsx");
    return this;
  }

  withVitest(): this {
    this._devDependencies.add("vitest");
    this._devDependencies.add("vite-tsconfig-paths");
    this._flags.add("vitest");
    return this;
  }

  runInstall(packageManager: string, workingDir: string): void {
    let installCmd = "install";
    switch (packageManager) {
      case "npm":
        installCmd = "install";
        break;
      case "yarn":
        installCmd = "add";
        break;
      case "pnpm":
        installCmd = "add";
        break;
      default:
        logger.error(`Unsupported package manager: ${packageManager}`);
        throw new Error(`Unsupported package manager: ${packageManager}`);
    }
    this._executeInstall(packageManager, installCmd, workingDir);
  }

  _executeInstall(
    packageManager: string,
    installCmd: string,
    workingDir: string,
  ): void {
    if (this._dependencies.size > 0) {
      const args = [installCmd, "--save", ...Array.from(this._dependencies)];
      logger.debug(`Running \`${packageManager} ${args.join(" ")}\``);

      spawnSync(packageManager, args, {
        stdio: "inherit",
        cwd: workingDir,
      });
    }
    if (this._devDependencies.size > 0) {
      const args = [
        installCmd,
        "--save-dev",
        ...Array.from(this._devDependencies),
      ];
      logger.debug(`Running \`${packageManager} ${args.join(" ")}\``);

      spawnSync(packageManager, args, {
        stdio: "inherit",
        cwd: workingDir,
      });
    }
  }
}
