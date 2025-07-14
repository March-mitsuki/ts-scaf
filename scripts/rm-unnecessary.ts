import path from "path";
import fs from "fs";

function main() {
  const distPath = path.resolve(process.cwd(), "dist");
  if (!fs.existsSync(distPath)) return;

  const unnecessaryFiles = [
    "bin.js",
    "bin.js.map",
    "bin.d.ts",
    "cjs/bin.cjs",
    "cjs/bin.cjs.map",
    "cjs/bin.d.cts",
  ];
  for (const file of unnecessaryFiles) {
    const filePath = path.resolve(distPath, file);
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath, { recursive: true, force: true });
      console.log(`[Scripts] Removed unnecessary file: ${filePath}`);
    }
  }
}

main();
