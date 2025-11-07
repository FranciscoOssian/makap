# makap

> Make Applications — a small hybrid helper (CLI + Electron) to turn YAML-described services into desktop "apps".

makap converts YAML service descriptions into desktop entries and helps you build and run Docker Compose services or open web UIs as standalone apps. Recent changes make `~/.makap` the recommended workspace: put your makap config (`config.yaml`), icons, and compose files there. Note: makap now treats paths in the config mostly as raw values and does not consistently resolve relative paths — using absolute paths in `config.yaml` is recommended.

## Quick start

Store your makap configuration and assets under `~/.makap` (recommended). The main makap file should be `~/.makap/config.yaml`.

Create directories and copy example files (adjust paths as needed):

```bash
mkdir -p ~/.makap/icons ~/.makap/compose
cp example/config.yaml ~/.makap/config.yaml   # or your edited config
cp example/n8n.png ~/.makap/icons/
cp example/n8n.yaml ~/.makap/compose/
```

Then run build pointing to the config in `~/.makap`:

```bash
npm link        # optional during development to install the CLI globally
makap build ~/.makap/config.yaml
```

Expected (short) output:

```
🔧 Starting build with config: /home/youruser/.makap/teste.yaml
🔧 Starting build for: n8n
✅ (n8n) Build completed successfully!
🌎 Creating desktop entry for: n8n
✅ Build completed successfully!
```

![result](https://i.imgur.com/FGTYTMN.png)
![result](https://i.imgur.com/dngB3Bk.png)

IMPORTANT:

- Centralize artifacts in `~/.makap`: icons, compose files and the makap YAML (use `~/.makap/config.yaml`).
- makap currently treats paths from the config as raw values and does not reliably resolve relative paths. Prefer absolute paths in `config.yaml` (for example `/home/ossian/.makap/icons/n8n.png`).
- If your service uses Docker volumes for persistence (for example n8n), create the host directories used by the compose file manually and set appropriate ownership/permissions before starting containers. This avoids common permission errors when containers try to access mounted host directories.

## Key features

- Convert YAML-described services into Linux desktop entries (`.desktop`).
- Build and run Docker Compose services described in the YAML.
- Open service UIs in an Electron BrowserWindow or in the default browser.
- Lightweight CLI with `build` and `up` commands.

## Installation

Clone and install dependencies (development):

```bash
git clone https://github.com/FranciscoOssian/makap.git
cd makap
npm install
npm link
```

Two commands are provided in `package.json`:

- `makap` -> `src/cli/agent/index.js` (agent CLI: build / up)
- `makap-window` -> `src/cli/window/index.js` (Electron window runner)

On Linux there's a wrapper script `sh/makap.sh` that loads `nvm` for GUI sessions. Use it when launching Electron from graphical sessions that don't load your shell environment automatically:

```bash
sh/makap.sh up <service>
```

Or, after `npm link`:

```bash
makap up <service>
# or
makap-window up <service>
```

## Recommended layout in ~/.makap

Place in `~/.makap`:

- `config.yaml` (main makap config)
- a directory for icons, e.g. `~/.makap/icons/`
- a directory for compose files, e.g. `~/.makap/compose/`

Example layout:

```text
~/.makap/
├─ config.yaml
├─ icons/
│  └─ n8n.png
└─ compose/
  └─ n8n.yaml
```

Run the build pointing at `~/.makap/config.yaml`. Because makap treats config paths as raw, prefer absolute paths inside `config.yaml` (see example below).

## Main commands

- `makap build <path-to-config>`: use the makap config and create desktop entries where applicable; runs Compose build for referenced Compose files.
- `makap up <service-name>`: reads the configuration and starts the service's compose (if present) and opens the UI.
- `makap-window up <service-name>`: opens the service UI in an Electron window. Note: the internal Electron CLI is documented for inspection and testing, but in normal usage it's executed by the generated `.desktop` files.

## YAML format

The config must contain a top-level `services:` mapping. Because makap now treats paths as raw values, use absolute paths in the config to avoid ambiguity. Example (this matches the example you tested locally):

```yaml
services:
  n8n:
    Name: n8n
    Icon: /home/ossian/.makap/icons/n8n.png
    Compose: /home/ossian/.makap/compose/n8n.yaml
    URL: http://localhost:5678
    Type: Application
    Categories:
      - Development
      - Utility
    Exec: bash /home/ossian/repos/makap/sh/makap.sh up n8n
  google:
    Name: Google
    URL: http://www.google.com.br
    Type: Application
```

Notes:

- `Compose` should point to a valid Docker Compose file (absolute path recommended).
- `Icon` should be an absolute path (or a path you guarantee to exist). In practice, put icons under `~/.makap/icons/` and reference them with absolute paths.
- `Exec` (if provided) will be written into the generated `.desktop` entry — it can point to the `sh/makap.sh` wrapper that launches the Electron window with the proper environment.

Persistence note:

- If a service's compose mounts host directories for persistence (volumes), create those host directories manually and set ownership/permissions before starting the container (for example chown/chmod). makap does not automatically prepare host persistence directories or manage permissions for you.

## Desktop entry generation (Linux)

On Linux makap generates `.desktop` files under `~/.local/share/applications`. List fields such as `Categories` are serialized with trailing semicolons (e.g. `Development;Utility;`) according to the desktop entry spec.

## Notes and limitations

- The "stop" action (stopping/removing containers) may not work reliably on all environments — this is a known limitation to improve.

## Development

Relevant files:

- `src/cli/agent/index.js` — CLI entry (build / up)
- `src/core/build.js` — build flow and desktop entry creation
- `src/core/up.js` — starts services (compose / opens UI)
- `src/service/dockerCompose/index.js` — wrappers for `docker compose`
- `src/service/desktopEntry/*` — desktop entry generators
- `src/cli/window/index.js` — Electron runner
- `sh/makap.sh` — wrapper for graphical sessions on Linux

### Testing locally

To test the Electron window during development:

```bash
npx electron src/cli/window/index.js up <service>
```

## Contributing

Contributions welcome. Open an issue or a PR describing your change.

## License

MIT
