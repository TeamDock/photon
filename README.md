<p align="center">
  <a aria-label="Photon logo" href="https://github.com/TeamDock/photon">
    <img height="95" src="https://raw.githubusercontent.com/TeamDock/photon/main/assets/Icon.png">
  </a>

  <p align="center" style="font-size: 25px;" >Photon</p>

  <p align="center" style="font-size: 15px;" >A simple terminal using Electron</p>

  <div align="center">
    <a aria-label="badges" href="https://github.com/TeamDock/photon">
        <img height="22" src="https://img.shields.io/github/downloads/teamdock/photon/total?style=for-the-badge" />
        <img height="22" src="https://img.shields.io/github/package-json/v/teamdock/photon?style=for-the-badge" />
    </a>
  </div>
</p>

# More about Photon


# Download
*Warning: Windows tested only!*
## Windows

# Contribute

1. Fork this repository to your own GitHub account and then clone it to your local device
2. Run `npm i` to install all dependencies
3. To run the application use: `npm run dev`
   
To make sure that your code works in production, you can generate the binaries using:

```bash
npm run release
```

After that, you will see the binary in the `./release` folder!

#### Known issues that can happen during development

##### Error building `node-pty`

If after building during development you get an alert dialog related to `node-pty` issues,
make sure its build process is working correctly by running `npm run rebuild`.

## Related Repositories

- [Hyper](https://github.com/vercel/hyper) (Project based on Hyper)
- [Photon default theme](https://github.com/TeamDock/photon-default-theme)