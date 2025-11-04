# makap

> Make Applications ~~Portable?~~

makap is a small hybrid CLI + Electron helper that lets you turn services described in YAML
into desktop "apps". It supports Docker Compose services and simple URLs and creates
desktop entries so services can be launched from the desktop environment.

## Fast use

```shell
makap@makap:~$ npm link
makap@makap:~$ ls example/
n8n_data  n8n.png  n8n.yaml  teste.yaml
makap@makap:~$ makap build example/teste.yaml
🔧 Starting build with config: /example/teste.yaml
🔧 Yaml stored:  /store/config.yaml
🔧 Starting build for: n8n
✅ (n8n) Build completed successfully!
🌎 Creating desktop entry for: n8n
🌎 Resolving path: n8n
🔍: taget linux
🌎 Creating desktop entry for: google
🌎 Resolving path: google
🔍: taget linux
✅ (wakap) Build completed successfully!
makap@makap:~$
```

![result](https://i.imgur.com/FGTYTMN.png)
![result](https://i.imgur.com/dngB3Bk.png)

> IMPORTANT
>
> The exit action for stop docker containers its not working

## Key features

- Convert YAML-described services into desktop apps (.desktop files on Linux)
- Build and run Docker Compose services described in a makap YAML
- Open service UIs in the default browser or inside an Electron BrowserWindow
- Lightweight CLI for `build` and `up` flows

## Installation

makap is a Node.js project that uses ES modules. For local development, clone the repo and
install dependencies:

```bash
git clone https://github.com/FranciscoOssian/makap.git
cd makap
npm install
npm link
```

There are two main entry points exposed as CLI commands in `package.json`:

- `makap` -> `src/cli/agent/index.js` (agent CLI for build/up)
- `makap-window` -> `src/cli/window/index.js` (Electron window runner)

On Linux you can use the provided wrapper shell script which loads nvm for GUI sessions:

```bash
sh/makap.sh <args>
```

## Usage

Build a YAML config and create desktop entries:

```bash
makap build /path/to/teste.yaml
```

Start/run a service, see your desktop entrie created (only linux for now)

The `build` command copies your YAML into `store/config.yaml`, builds compose services
(if `Compose` is provided) and generates desktop entries under
`~/.local/share/applications` on Linux.

The `up` command reads `store/config.yaml` and for a given service will start
the compose (if present) and open the service UI (HTTPS or Localhost).

## YAML format

The YAML file must contain a top-level `services:` mapping. Each service may contain
fields like the following:

```yaml
services:
  my-service:
    Name: My Service
    Icon: ./icon.png # path relative to the YAML file (will be resolved)
    Compose: ./docker-compose.yaml
    URL: http://localhost:3000
    Categories:
      - Development
      - Utility
    Type: Application
```

## the service: Linux desktop entries format + Electron props

You can costumize the webview, but now its not working well.

```yaml
services:
  my-service:
    Name: My Service
    Icon: ./icon.png # path relative to the YAML file (will be resolved)
    Compose: ./docker-compose.yaml
    URL: http://localhost:3000
    Categories:
      - Development
      - Utility
    Type: Application
    AlwaysOnTop: True,
    Opacity: 0.5
```

Notes:

- `Compose` should point to a
  Docker Compose file.
- `Exec` will be written into the generated `.desktop` file. Do not user this field.

## Desktop entry generation

On Linux, makap generates `.desktop` files under `~/.local/share/applications`.
The generator ensures list fields (like `Categories`) are serialized with trailing
semicolons (`Development;Utility;`) as expected by the desktop specification.

## Development

Project layout (important files):

- `src/cli/agent/index.js` - CLI entry (build / up)
- `src/core/build.js` - handles build flow: copy yaml to `store`, run compose build and create desktop entries
- `src/core/up.js` - handles start/up flow: reads `store/config.yaml`, runs compose up and opens UI
- `src/service/dockerCompose/index.js` - wrappers for `docker compose` (build/up/down)
- `src/service/desktopEntry/linux.js` - generates `.desktop` files for Linux
- `src/cli/window/index.js` - Electron BrowserWindow runner
- `sh/makap.sh` - wrapper shell that sources nvm for GUI sessions

### Running locally

To run the Electron window CLI for testing:

```bash
npx electron src/cli/window/index.js up <service>
```

## Contributing

Contributions are welcome. Open an issue or PR describing the improvement. This project was completed in a short time, and therefore has many flaws to fill and improvements to be made.

## License

MIT
