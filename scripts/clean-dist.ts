import path from "path";
import fs from "fs";

function main() {
  const distPath = path.resolve(process.cwd(), "dist");
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log(`[Scripts] Removed existing 'dist' directory at ${distPath}`);
  }
}

main();
