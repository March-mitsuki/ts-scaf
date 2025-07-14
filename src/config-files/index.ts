import path from "path";
import fs from "fs";

import { ConfigFlag } from "@/installation";
import TsConfigTemplate from "./tsconfig-json.template";
import ESLintConfigTSTemplate from "./eslint-config-ts.template";
import PrettierConfigJSTemplate from "./prettier-config-js.template";
import GitignoreTemplate from "./gitignore.tmplate";
import ReadmeTemplate from "./readme.tmplate";
import PackageJsonTmplate from "./package-json.tmplate";

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
      this._addESLintConfigTS();
    } else {
      logger.error("Warning: Only eslint.config.ts is supported now.");
      logger.error(
        "Warning: ESLint configuration will not be generated as 'eslint-tsconfig' flag is not set.",
      );
    }

    if (this._flags.has("prettier")) {
      this._addPrettierConfigJS();
    }

    this._addTsConfigJson();
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

  _addTsConfigJson(): this {
    const tsConfigPath = "tsconfig.json";
    const tsConfigContent = TsConfigTemplate;

    this._writers.set(tsConfigPath, tsConfigContent);
    return this;
  }

  _addESLintConfigTS(): this {
    const eslintConfigTSPath = "eslint.config.ts";
    const eslintConfigTSContent = ESLintConfigTSTemplate;

    this._writers.set(eslintConfigTSPath, eslintConfigTSContent);
    return this;
  }

  _addPrettierConfigJS(): this {
    const prettierConfigJSPath = "prettier.config.js";
    const prettierConfigJSContent = PrettierConfigJSTemplate;

    this._writers.set(prettierConfigJSPath, prettierConfigJSContent);
    return this;
  }

  _addPackageJSON(): this {
    const packageJsonPath = "package.json";
    const packageJsonContent = PackageJsonTmplate.replace(
      ...makeReplacer("name", this._projectName),
    );

    this._writers.set(packageJsonPath, packageJsonContent);
    return this;
  }

  _addGitignore(): this {
    const gitignorePath = ".gitignore";
    const gitignoreContent = GitignoreTemplate;

    this._writers.set(gitignorePath, gitignoreContent);
    return this;
  }

  _addReadme(): this {
    const readmePath = "README.md";
    const readmeContent = ReadmeTemplate;

    this._writers.set(readmePath, readmeContent);
    return this;
  }

  _addSrcDir(): this {
    const srcDirPath = path.join("src", "index.ts");
    let srcDirContent = "// Entry point for your TypeScript application";
    srcDirContent += `\n\nconsole.log("Welcome to ${this._projectName}");\n`;

    this._writers.set(srcDirPath, srcDirContent);
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
