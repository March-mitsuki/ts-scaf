/* eslint-disable @typescript-eslint/no-explicit-any */
export class Color {
  static _platform = process.platform;

  static red(text: string): string {
    if (this._platform === "win32") {
      return text;
    }
    return `\x1b[31m${text}\x1b[0m`; // Red color
  }
  static green(text: string): string {
    if (this._platform === "win32") {
      return text;
    }
    return `\x1b[32m${text}\x1b[0m`; // Green color
  }
  static yellow(text: string): string {
    if (this._platform === "win32") {
      return text;
    }
    return `\x1b[33m${text}\x1b[0m`; // Yellow color
  }
  static blue(text: string): string {
    if (this._platform === "win32") {
      return text;
    }
    return `\x1b[34m${text}\x1b[0m`; // Blue color
  }
  static magenta(text: string): string {
    if (this._platform === "win32") {
      return text;
    }
    return `\x1b[35m${text}\x1b[0m`; // Magenta color
  }
  static cyan(text: string): string {
    if (this._platform === "win32") {
      return text;
    }
    return `\x1b[36m${text}\x1b[0m`; // Cyan color
  }
  static white(text: string): string {
    if (this._platform === "win32") {
      return text;
    }
    return `\x1b[37m${text}\x1b[0m`; // White color
  }
  static reset(text: string): string {
    if (this._platform === "win32") {
      return text;
    }
    return `\x1b[0m${text}\x1b[0m`; // Reset color
  }
}

type LoggerConfig = {
  level?: string;
};
export class Logger {
  _level = 1; // Default level is 'info'

  constructor(cfg?: LoggerConfig) {
    if (!cfg) {
      cfg = { level: "info" };
    }

    this.setLevel(cfg.level!);
  }

  setLevel(name: string): void {
    switch (name) {
      case "debug":
        this._level = 0;
        break;
      case "info":
        this._level = 1;
        break;
      case "warn":
        this._level = 2;
        break;
      case "error":
        this._level = 3;
        break;
      default:
        throw new Error(`Unknown log level: ${name}`);
    }
  }

  debug(...args: any[]): void {
    if (this._level > 0) return;
    console.debug("[ DEBUG ]", ...args);
  }
  info(...args: any[]): void {
    if (this._level > 1) return;
    console.info(Color.blue("[  INFO ]"), ...args);
  }
  warn(...args: any[]): void {
    if (this._level > 2) return;
    console.warn(Color.yellow("[  WARN ]"), ...args);
  }
  error(...args: any[]): void {
    if (this._level > 3) return;
    console.error(Color.red("[ ERROR ]"), ...args);
  }
}

export class Logging {
  _loggers: Map<string, Logger> = new Map();
  _globalLevel: string = "info";

  getLogger(name: string, cfg?: LoggerConfig): Logger {
    if (!this._loggers.has(name)) {
      const logger = new Logger({ ...cfg, level: this._globalLevel });
      this._loggers.set(name, logger);
    }
    return this._loggers.get(name)!;
  }

  setGlobalLevel(name: string): void {
    this._globalLevel = name;
    for (const logger of this._loggers.values()) {
      logger.setLevel(name);
    }
  }
}

const logging = new Logging();
export default logging;
