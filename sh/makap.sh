#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Caminho absoluto do script atual
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Caminho relativo ao diretório do projeto
PROJECT_ROOT="$(realpath "$SCRIPT_DIR/..")"

npx electron "$PROJECT_ROOT/src/cli/window/index.js" "$@"
