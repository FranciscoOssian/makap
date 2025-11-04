import { execSync } from "child_process";

export function resolveMakapExecPath(execCmd) {
  const possibleNames = ["makap", "makap-window"];
  let result = execCmd;

  for (const name of possibleNames) {
    if (!result.includes(name)) continue;
    try {
      const fullPath = execSync(`which ${name}`).toString().trim();
      result = result.replace(new RegExp(`\\b${name}\\b`, "g"), fullPath);
    } catch {
      console.warn(`⚠️ ${name} not found in PATH, keeping as-is`);
    }
  }

  return result;
}
