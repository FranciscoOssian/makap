import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import YAML from "yaml";
import { buildCompose } from "../service/dockerCompose/index.js";
import { makeDesktopEntry } from "../service/desktopEntry/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function build(filePath) {
  console.log("🔧 Starting build with config:", filePath);

  const file = fs.readFileSync(filePath, "utf8");
  const configs = YAML.parse(file);

  if (!configs.hasOwnProperty("services")) {
    throw new Error("services not found");
  }

  for (const key of Object.keys(configs["services"])) {
    const service = configs["services"][key];
    if (!service.Compose) continue;

    const composePath = path.resolve(service.Compose);

    console.log("🔧 Starting build for:", service.Compose);
    await buildCompose(composePath);
    console.log(`✅ (${key}) Build completed successfully!`);
  }

  for (const key of Object.keys(configs["services"])) {
    const service = configs["services"][key];
    if (!service.Icon) continue;

    console.log("🌎 Creating desktop entry for:", key);

    if (!service.hasOwnProperty("Exec")) {
      service["Exec"] = `bash ${path.resolve(
        __dirname,
        "../../sh/makap"
      )}.sh up ${key}`;
    }

    await makeDesktopEntry(service);
  }

  console.log("✅ (wakap) Build completed successfully!");
}
