import { defineConfig } from "tsup";

export default defineConfig([
  // executable file
  {
    entry: ["src/bin.ts"],
    format: ["esm"],
    target: "node22",
    outDir: "dist/bin",
    clean: false,
  },
  // library build - ESM
  {
    entry: ["src/**/*.ts"],
    format: ["esm"],
    bundle: false,
    splitting: true,
    sourcemap: true,
    dts: true,
    target: "node22",
    outDir: "dist",
    clean: false,
  },
  // library build - CJS
  {
    entry: ["src/**/*.ts"],
    format: ["cjs"],
    bundle: false,
    sourcemap: true,
    splitting: true,
    dts: true,
    target: "node22",
    outDir: "dist/cjs",
    clean: false,
  },
]);
