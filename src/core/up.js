import fs from "fs";
import YAML from "yaml";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { startCompose } from "../service/dockerCompose/index.js";

export async function up(serviceName) {
  function wakeUpApp() {
    return new Promise((resolve, reject) => {
      console.log(__dirname);
      const proc = spawn("npm", ["run", "start", "up", serviceName], {
        stdio: "inherit",
        cwd: path.resolve(__dirname, "../../"),
        shell: true,
      });

      proc.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`makap up exited with code ${code}`));
        }
      });
    });
  }

  const storePath = path.resolve(__dirname, "../store/config.yaml");

  const file = fs.readFileSync(
    path.resolve(__dirname, "../../store/config.yaml"),
    "utf8"
  );
  console.log(file);
  const config = YAML.parse(file);

  if (!config["services"].hasOwnProperty(serviceName))
    return console.log("❌ Service not found");

  console.log(`open service: ${serviceName}`);

  if (config["services"][serviceName].hasOwnProperty("Compose"))
    await startCompose(config["services"][serviceName]["Compose"]);

  if (config["services"][serviceName].hasOwnProperty("URL")) wakeUpApp();
}
