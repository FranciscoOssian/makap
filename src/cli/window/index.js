#!/usr/bin/env node

import pkg from "electron";
import YAML from "yaml";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const { app, BrowserWindow } = pkg;

import {
  stopCompose,
  startCompose,
} from "../../service/dockerCompose/index.js";
import { program } from "commander";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name("Makap Window")
  .description("CLI for makap Window layer")
  .version("0.8.0");

program
  .command("up")
  .description("Open a service")
  .argument("[service]", "service to open")
  .action((serviceName) => service(serviceName));

program.parse();

function service(serviceName) {
  console.log(`open service: ${serviceName}`);

  app.whenReady().then(async () => {
    try {
      const configPath = path.resolve(__dirname, "../../../store/config.yaml");
      const file = fs.readFileSync(configPath, "utf8");
      const config = YAML.parse(file);

      const serviceConfig = config.services[serviceName];
      if (!serviceConfig) {
        console.error("❌ Service not found");
        return;
      }

      console.log(serviceConfig);

      if (serviceConfig.hasOwnProperty("Compose")) {
        console.log("start", serviceConfig.Compose);
        startCompose(serviceConfig.Compose);
      }

      if (serviceConfig.hasOwnProperty("URL")) {
        const win = createWindow(serviceConfig);
        win.on("closed", async () => {
          if (serviceConfig.Compose) {
            await stopCompose(serviceConfig.Compose);
          }
        });
      }

      // Se quiser, aqui você pode também chamar startCompose(serviceConfig.compose)
    } catch (err) {
      console.error("Error opening service:", err);
    }
  });
}

function createWindow(serviceConfig) {
  const mapConfigKeys = {
    width: 1200,
    height: 800,
    x: undefined,
    y: undefined,
    useContentSize: false,
    center: false,
    minWidth: undefined,
    minHeight: undefined,
    maxWidth: undefined,
    maxHeight: undefined,
    resizable: true,
    movable: true,
    minimizable: true,
    maximizable: true,
    closable: true,
    focusable: true,
    alwaysOnTop: false,
    fullscreen: false,
    fullscreenable: true,
    simpleFullscreen: false,
    skipTaskbar: false,
    kiosk: false,
    title: undefined,
    icon: undefined,
    show: true,
    frame: true,
    parent: undefined,
    modal: false,
    backgroundColor: undefined,
    hasShadow: true,
    opacity: 1,
    thickFrame: true,
    tabbingIdentifier: undefined,
    autoHideMenuBar: true,
    menuBarVisible: true,
    titleBarStyle: "hidden",
    titleBarOverlay: true,
    trafficLightPosition: undefined,
  };

  Object.keys(mapConfigKeys).map((key) => {
    const serviceKey = key.charAt(0).toUpperCase() + key.slice(1);
    serviceConfig.hasOwnProperty(serviceKey)
      ? (mapConfigKeys[key] = serviceConfig[serviceKey])
      : [];
  });

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    ...mapConfigKeys,
  });

  win.loadURL(serviceConfig.URL);
  return win;
}
