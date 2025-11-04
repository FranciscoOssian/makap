import fs from "fs";
import path from "path";
import ini from "ini";

export async function createLinuxDesktopEntry(serviceObj) {
  const allowedFields = [
    "Type",
    "Version",
    "Name",
    "GenericName",
    "NoDisplay",
    "Comment",
    "Icon",
    "Hidden",
    "OnlyShowIn",
    "NotShowIn",
    "DBusActivatable",
    "TryExec",
    "Exec",
    "Path",
    "Terminal",
    "Actions",
    "MimeType",
    "Categories",
    "Implements",
    "Keywords",
    "StartupNotify",
    "StartupWMClass",
    "URL",
    "PrefersNonDefaultGPU",
    "SingleMainWindow",
  ];

  const desktopEntry = { "Desktop Entry": {} };
  for (const key of allowedFields) {
    if (serviceObj.hasOwnProperty(key)) {
      desktopEntry["Desktop Entry"][key] = Array.isArray(serviceObj[key])
        ? serviceObj[key].join(";") + ";" // sem replace
        : serviceObj[key];
    }
  }

  if (!desktopEntry["Desktop Entry"].Type) {
    desktopEntry["Desktop Entry"].Type = "Application";
  }

  const desktopContent = ini.stringify(desktopEntry, {
    section: "",
  });

  const desktopPath = path.join(
    process.env.HOME,
    ".local",
    "share",
    "applications",
    `${serviceObj.Name || "app"}.desktop`
  );

  fs.mkdirSync(path.dirname(desktopPath), { recursive: true });
  fs.writeFileSync(desktopPath, desktopContent, { mode: 0o755 });
}
