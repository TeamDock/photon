# Used from https://github.com/vercel/hyper/blob/canary/build/linux/after-install.tpl

#!/bin/bash

mkdir -p /usr/local/bin

# Link to the CLI bootstrap
ln -sf '/opt/${productFilename}/resources/bin/${executable}' '/usr/local/bin/${executable}'