#!/usr/bin/env node

import pkg from "electron";
import YAML from "yaml";
import fs from "fs";
import path from "path";
import { makapDir } from "../../consts/index.js";
import { mapConfigKeys } from "./mapConfigKeys.js";
const { app, BrowserWindow } = pkg;

import {
  stopCompose,
  startCompose,
} from "../../service/dockerCompose/index.js";
import { program } from "commander";

async function waitForService(url, timeout = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return true; // server is up
    } catch (e) {
      // server does not respond yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Timeout waiting for service: ${url}`);
}

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
      const configPath = path.join(makapDir, "config.yaml");
      console.log(configPath);
      const file = fs.readFileSync(configPath, "utf8");
      const config = YAML.parse(file);

      const serviceConfig = config.services[serviceName];
      if (!serviceConfig) {
        console.error("❌ Service not found");
        return;
      }

      if (serviceConfig.hasOwnProperty("Compose")) {
        console.log("start", serviceConfig.Compose);
        await startCompose(serviceConfig.Compose);
      }

      if (serviceConfig.hasOwnProperty("URL")) {
        await waitForService(serviceConfig.URL);
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
