import { createLinuxDesktopEntry } from "./linux.js";

const platform = process.platform; // 'linux', 'win32', 'darwin'

export async function makeDesktopEntry(serviceObj) {
  switch (platform) {
    case "linux":
      console.log("🔍: taget linux");
      await createLinuxDesktopEntry(serviceObj);
      break;
    case "win32":
      //require("./windows").createShortcut(serviceObj);
      break;
    case "darwin":
      //require("./macos").createShortcut(serviceObj);
      break;
  }
}
