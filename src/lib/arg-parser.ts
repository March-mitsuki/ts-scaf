/* eslint-disable @typescript-eslint/no-explicit-any */
import logging from "./logging";
const logger = logging.getLogger("global");

type ArgAction = "store" | "store-bool";
type ArgValueType = "str" | "int" | "float" | "bool";
type ArgConfig = {
  flag: string;
  shortFlag?: string;
  action: ArgAction;
  required?: boolean;
  type?: ArgValueType;
  default?: any;
  description?: string;
};

/**
 * A simple command-line argument parser for Node.js scripts.
 * Do not support positional arguments and subcommands.
 */
export class ArgParser {
  private argConfigs: Record<string, ArgConfig> = {};
  private shortToLong: Record<string, string> = {};
  scriptName: string;
  description?: string;

  constructor(scriptName: string, description: string) {
    this.scriptName = scriptName;
    this.description = description;

    this.addArg({
      flag: "--help",
      shortFlag: "-h",
      action: "store-bool",
      required: false,
      type: "bool",
      default: false,
      description: "Show help message",
    });
  }

  private _validateValue(key: string, value: any, type?: ArgValueType) {
    if (type) {
      switch (type) {
        case "int": {
          const v = parseInt(value, 10);
          if (isNaN(v)) {
            logger.error(`Invalid integer value for --${key}: ${value}`);
            throw new Error(`Invalid integer value for --${key}: ${value}`);
          }
          return v;
        }
        case "float": {
          const v = parseFloat(value);
          if (isNaN(v)) {
            logger.error(`Invalid float value for --${key}: ${value}`);
            throw new Error(`Invalid float value for --${key}: ${value}`);
          }
          return v;
        }
        case "bool": {
          const v = value.toLowerCase();
          if (v === "true" || v === "1") {
            return true;
          } else if (v === "false" || v === "0") {
            return false;
          } else {
            logger.error(`Invalid boolean value for --${key}: ${value}`);
            throw new Error(`Invalid boolean value for --${key}: ${value}`);
          }
        }
        case "str":
        default: {
          return value;
        }
      }
    } else {
      return value;
    }
  }

  private _includeHelpFlag(argv: string[]): boolean {
    return argv.includes("--help") || argv.includes("-h");
  }

  printHelp() {
    console.log(`${this.scriptName}`);
    if (this.description) {
      console.log(`Description: ${this.description}\n`);
    }
    console.log("Available arguments:");
    for (const [key, config] of Object.entries(this.argConfigs)) {
      let flags = `--${key}`;
      if (config.shortFlag) {
        const displayShort = config.shortFlag.startsWith("-")
          ? config.shortFlag
          : `-${config.shortFlag}`;
        flags += `, ${displayShort}`;
      }
      const type = config.type ? ` (${config.type})` : "";
      const required = config.required ? " (required)" : "";
      const defaultValue =
        config.default !== undefined ? ` (default: ${config.default})` : "";
      console.log(
        `  ${flags}${type}${required}${defaultValue} - ${config.description || "No description"}`,
      );
    }
  }

  addArg(config: ArgConfig) {
    const flag = config.flag.replace(/^--/, "");
    if (this.argConfigs[flag]) {
      throw new Error(`Argument '--${flag}' already defined`);
    }
    this.argConfigs[flag] = config;

    if (config.shortFlag) {
      const short = config.shortFlag.replace(/^-/, "");
      if (this.shortToLong[short]) {
        throw new Error(`Short flag '-${short}' already in use`);
      }
      this.shortToLong[short] = flag;
    }
  }

  parse<T = Record<string, any>>(argv: string[] = process.argv.slice(2)): T {
    if (this._includeHelpFlag(argv)) {
      this.printHelp();
      process.exit(0);
    }

    const result: Record<string, any> = {};

    const usedFlags = new Set<string>();

    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];

      if (arg.startsWith("--")) {
        const [rawKey, valueFromEq] = arg.slice(2).split("=");
        const config = this.argConfigs[rawKey];
        if (!config) {
          logger.error(`Unknown argument: --${rawKey}`);
          throw new Error(`Unknown argument: --${rawKey}`);
        }

        usedFlags.add(rawKey);

        if (config.action === "store-bool") {
          result[rawKey] = true;
        } else {
          const value = valueFromEq ?? argv[++i];
          if (value === undefined) {
            logger.error(`Missing value for argument: --${rawKey}`);
            throw new Error(`Missing value for argument: --${rawKey}`);
          }
          result[rawKey] = this._validateValue(rawKey, value, config.type);
        }
      } else if (arg.startsWith("-")) {
        const shortKey = arg.slice(1);
        const longKey = this.shortToLong[shortKey];
        if (!longKey) {
          logger.error(`Unknown short argument: -${shortKey}`);
          throw new Error(`Unknown short argument: -${shortKey}`);
        }
        const config = this.argConfigs[longKey];

        usedFlags.add(longKey);

        if (config.action === "store-bool") {
          result[longKey] = true;
        } else {
          const value = argv[++i];
          if (value === undefined) {
            logger.error(`Missing value for argument: -${shortKey}`);
            throw new Error(`Missing value for argument: -${shortKey}`);
          }
          result[longKey] = this._validateValue(longKey, value, config.type);
        }
      } else {
        logger.error(`Unexpected argument: ${arg}`);
        throw new Error(`Unexpected argument: ${arg}`);
      }
    }

    // 检查 required & 设置默认值
    for (const [key, config] of Object.entries(this.argConfigs)) {
      if (!(key in result)) {
        if (config.required) {
          logger.error(`Missing required argument: --${key}`);
          throw new Error(`Missing required argument: --${key}`);
        }
        if (config.default !== undefined) {
          result[key] = config.default;
        }
      }
    }

    return result as T;
  }
}
