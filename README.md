<p align="center">
  <a aria-label="Photon logo" href="https://github.com/TeamDock/photon">
    <img height="95" src="https://raw.githubusercontent.com/TeamDock/photon/main/assets/icon.png">
  </a>

  <p align="center" style="font-size: 25px;" >Photon</p>

  <p align="center" style="font-size: 15px;" >A simple terminal using Electron</p>

  <div align="center">
    <a aria-label="badges">
        <a href="https://github.com/TeamDock/photon/releases">
            <img height="22" alt="GitHub all releases" src="https://img.shields.io/github/downloads/teamdock/photon/total?color=%23EF5DA8&label=Downloads&style=for-the-badge">
        </a>
        <a>
            <img height="22" src="https://img.shields.io/github/package-json/v/teamdock/photon?color=%23EF5DA8&style=for-the-badge" />
        </a>
    </a>
  </div>
</p>

# More about Photon
Photon is a cross-platform terminal-emulator using React and Electron for developers.

# Download
[Click here](https://github.com/TeamDock/photon/releases) to download.

# Contribute

First of all, you need to install some necessary packages: 

 * Windows
    * Be sure to run `npm install windows-build-tools --global` from an elevated prompt (as an administrator) to install windows-build-tools. 

1. Fork this repository to your own GitHub account and then clone it to your local device
2. Run `npm i` to install all dependencies
3. To run the application use: `npm run dev`

## Release
You can use Docker to generate all binaries, follow the step by step:
  1. Install the [Docker](https://docs.docker.com/get-docker/)
  2. Download the *electronuserland/builder* image: `docker pull electronuserland/builder`
  3. Run: `npm run release:docker`

*or you can use `npm run release`, but, is not recomended.*

After that, you will see the binary in the `./release` folder!

# Cli
On windows, the CLI is automatically install on PATH in environment variables: `photon <args>`

To test the CLI in development environment you can use: `npx ts-node ./cli/index.ts <args>`

# Known issues that can happen during development

#### Error building `node-pty`

If after building during development you get an alert dialog related to `node-pty` issues,
make sure its build process is working correctly by running `npm run rebuild`.

# Techs used:
 * [Electron](https://www.electronjs.org/)
 * [React](https://reactjs.org/)
 * [Node-pty](https://github.com/microsoft/node-pty)
 * [XTermjs](https://xtermjs.org/)


# Related Repositories

- [Hyper](https://github.com/vercel/hyper) (Project based on Hyper)
- [Photon default theme](https://github.com/TeamDock/photon-default-theme)