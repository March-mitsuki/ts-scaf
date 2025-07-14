import path from "path";
import fs from "fs";

import { ConfigFlag } from "@/installation";
import tsConfigTemplate from "./tsconfig-json.template";
import eSLintConfigTSTemplate from "./eslint-config-ts.template";
import prettierConfigJSTemplate from "./prettier-config-js.template";
import gitignoreTemplate from "./gitignore.tmplate";
import readmeTemplate from "./readme.tmplate";
import packageJsonTmplate from "./package-json.tmplate";
import indexTsTemplate from "./index-ts.template";
import vitestConfigTsTemplate from "./vitest-config-ts.template";
import indexTestTsTmplate from "./index-test-ts.tmplate";

import logging from "@/lib/logging";
const logger = logging.getLogger("global");

function makeReplacer(target: string, replacement: string) {
  return [new RegExp(`<>s*${target}s*<\\s*/\\s*>`, "g"), replacement] as const;
}

type ExtFlags = "readme" | "gitignore";
type ConfigFilesFlags = ConfigFlag | ExtFlags;
export class ConfigFiles {
  _flags: Set<ConfigFilesFlags>;
  _writers: Map<string, string> = new Map();
  _projectRoot: string;
  _projectName: string;

  constructor(
    flags: Set<ConfigFilesFlags>,
    projectRoot: string,
    projectName: string,
  ) {
    this._flags = flags;
    this._projectRoot = projectRoot;
    this._projectName = projectName;
  }

  parseFlags(...extFlags: ExtFlags[]): this {
    if (this._flags.has("eslint-tsconfig")) {
      this._addESLint();
    } else {
      logger.error("Warning: Only eslint.config.ts is supported now.");
      logger.error(
        "Warning: ESLint configuration will not be generated as 'eslint-tsconfig' flag is not set.",
      );
    }

    if (this._flags.has("prettier")) {
      this._addPrettier();
    }
    if (this._flags.has("vitest")) {
      this._addVitest();
    }

    this._addTsConfig();
    this._addGitignore();
    this._addPackageJSON();
    this._addSrcDir();

    if (extFlags.includes("readme")) {
      this._addReadme();
    }
    if (extFlags.includes("gitignore")) {
      this._addGitignore();
    }

    return this;
  }

  _addTsConfig(): this {
    const tsConfigPath = "tsconfig.json";
    const tsConfigContent = tsConfigTemplate;

    this._writers.set(tsConfigPath, tsConfigContent);
    return this;
  }

  _addESLint(): this {
    const eslintConfigTSPath = "eslint.config.ts";
    const eslintConfigTSContent = eSLintConfigTSTemplate;

    this._writers.set(eslintConfigTSPath, eslintConfigTSContent);
    return this;
  }

  _addPrettier(): this {
    const prettierConfigJSPath = "prettier.config.js";
    const prettierConfigJSContent = prettierConfigJSTemplate;

    this._writers.set(prettierConfigJSPath, prettierConfigJSContent);
    return this;
  }

  _addPackageJSON(): this {
    const packageJsonPath = "package.json";
    const packageJsonContent = packageJsonTmplate.replace(
      ...makeReplacer("name", this._projectName),
    );

    this._writers.set(packageJsonPath, packageJsonContent);
    return this;
  }

  _addGitignore(): this {
    const gitignorePath = ".gitignore";
    const gitignoreContent = gitignoreTemplate;

    this._writers.set(gitignorePath, gitignoreContent);
    return this;
  }

  _addReadme(): this {
    const readmePath = "README.md";
    const readmeContent = readmeTemplate;

    this._writers.set(readmePath, readmeContent);
    return this;
  }

  _addSrcDir(): this {
    const indexTsPath = path.join("src", "index.ts");
    const indexTsContent = indexTsTemplate.replace(
      ...makeReplacer("name", this._projectName),
    );

    this._writers.set(indexTsPath, indexTsContent);
    return this;
  }

  _addVitest(): this {
    const vitestConfigPath = "vitest.config.ts";
    const vitestConfigContent = vitestConfigTsTemplate;
    this._writers.set(vitestConfigPath, vitestConfigContent);

    const testDirPath = "tests";
    const indexTestTsPath = path.join(testDirPath, "index.test.ts");
    const indexTestTsContent = indexTestTsTmplate;
    this._writers.set(
      indexTestTsPath,
      indexTestTsContent.replace(...makeReplacer("name", this._projectName)),
    );

    return this;
  }

  write() {
    for (const [filePath, content] of this._writers.entries()) {
      const fullPath = path.resolve(this._projectRoot, filePath);
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      logger.debug(`Writing config file: ${fullPath}`);
      fs.writeFileSync(fullPath, content, "utf8");
    }
  }
}
