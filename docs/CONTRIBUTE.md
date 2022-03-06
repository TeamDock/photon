# 🔗 How to contribute
Every help is welcome! See how to contribute below

# Starting
First of all, you need to install some necessary packages:
 * Windows
    * Be sure to run `npm install windows-build-tools --global` from an elevated prompt (as an administrator) to install windows-build-tools. 

 1. Fork this repository on Github
 2. Make a clone of the created fork repository: `git clone https://github.com/youruser/photon.git`
 3. Create a branch to commit your feature or fix: `git checkout -b my-branch`
 4. Make sure to use `yarn` to install all dependencies

You can test the cli using: `yarn ts-node ./cli/index.ts <args>`

## When you're done, make your Pull Request!
 * Commit the changes: `yarn commit`
 * Push your branch to your fork: `git push origin my-branch`
 * Go to Pull Requests from the root repository and create a [Pull Request](https://github.com/TeamDock/photon/pulls) with your commit(s)

# Release
You can use Docker to generate all binaries, follow the step by step:
  1. Install the [Docker](https://docs.docker.com/get-docker/)
  2. Download the *electronuserland/builder* image: `docker pull electronuserland/builder`
  3. Run: `yarn release:docker`

*or you can use `yarn release`, but, is not recomended.*

After that, you will see the binary in the `./release` folder!

# CLI
On windows, the CLI is automatically install on PATH in environment variables: `photon <args>`

# Known issues that can happen during development

#### Error building `node-pty`

If after building during development you get an alert dialog related to `node-pty` issues,
make sure its build process is working correctly by running `npm run rebuild`.