import { spawn } from "child_process";

export function buildCompose(composePath) {
  return new Promise((resolve, reject) => {
    const proc = spawn("docker", ["compose", "-f", composePath, "build"], {
      stdio: "inherit",
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`docker compose exited with code ${code}`));
      }
    });
  });
}

export function startCompose(composePath) {
  return new Promise((resolve, reject) => {
    const proc = spawn("docker", ["compose", "-f", composePath, "up", "-d"], {
      stdio: "inherit",
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`docker compose exited with code ${code}`));
      }
    });
  });
}

export function stopCompose(composePath) {
  return new Promise((resolve, reject) => {
    const proc = spawn("docker", ["compose", "-f", composePath, "down"], {
      stdio: "inherit",
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`docker compose down exited with code ${code}`));
      }
    });
  });
}
