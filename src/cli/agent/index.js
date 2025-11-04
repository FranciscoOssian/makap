#!/usr/bin/env node

import { program } from "commander";
import { build } from "../../core/build.js";
import { up } from "../../core/up.js";
import path from "path";

program
  .name("Makap agent")
  .description("CLI for makap Agent layer")
  .version("0.8.0");

program
  .command("build")
  .description("Build your makap service")
  .argument("[file-path]", "file path for yaml makap file")
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    build(path.join(path.resolve(str.split(options.separator, limit)[0]), ""));
  });

program
  .command("up")
  .description("Run your makap service")
  .argument("[service-name]", "service to open")
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    up(str.split(options.separator, limit)[0]);
  });

program.parse();
