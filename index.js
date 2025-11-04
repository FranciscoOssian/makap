import pkg from "electron";
const { app, BrowserWindow } = pkg;

import { program } from "commander";

program
  .name("Makap electron")
  .description("CLI for makap electron layer")
  .version("0.8.0");

program
  .command("service")
  .description("Open a service")
  .argument("[service name]", "service to open")
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    service(str.split(options.separator, limit)[0]);
  });

program.parse();

function service(serviceName) {
  console.log(`open service: ${serviceName}`);
  app.whenReady().then(() => {
    const win = createWindow(serviceName);

    win.on("closed", () => {
      // Aqui você pode encerrar o container
      //stopDockerContainer("n8n");
    });
  });
}

function createWindow(url) {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // normalmente falso para segurança
      contextIsolation: true,
    },
  });

  win.loadURL(url);
  return win;
}
