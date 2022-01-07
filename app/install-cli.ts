// Based on https://github.com/vercel/hyper/blob/canary/app/utils/cli-install.ts

import * as Registry from 'native-reg';
import path from 'path';
import fs from 'fs';
import { app } from './main';
import sudoPrompt from 'sudo-prompt';
import { mkdirpSync } from 'fs-extra';
import { clipboard, dialog } from 'electron';

const linkPath = '/usr/local/bin/photon';
const cliScriptPath = path.resolve(__dirname, '../../bin/photon');

const checkInstall = () => {
    return fs.readlinkSync(linkPath) === cliScriptPath;
};

const addSymlink = async () => {
    try {
        const isInstalled = checkInstall();
        if (isInstalled) {
            console.log('Photon CLI already in PATH');
            return;
        }
        console.log('Linking Photon CLI');
        if (!fs.existsSync(path.dirname(linkPath))) {
            try {
                mkdirpSync(path.dirname(linkPath));
            } catch (err) {
                throw new Error(
                    `Failed to create directory ${path.dirname(
                        linkPath
                    )} - ${err}`
                );
            }
        }
        await fs.symlinkSync(cliScriptPath, linkPath);
    } catch (_err) {
        const err = _err as { code: string };
        // 'EINVAL' is returned by readlink,
        // 'EEXIST' is returned by symlink
        let error =
            err.code === 'EEXIST' || err.code === 'EINVAL'
                ? `File already exists: ${linkPath}`
                : `Symlink creation failed: ${err.code}`;
        // Need sudo access to create symlink
        if (err.code === 'EACCES') {
            const result = await dialog.showMessageBox({
                message: `You need to grant elevated privileges to add Photon CLI to PATH
  Or you can run
  sudo ln -sf "${cliScriptPath}" "${linkPath}"`,
                type: 'info',
                buttons: ['OK', 'Copy Command', 'Cancel'],
            });
            if (result.response === 0) {
                try {
                    sudoPrompt.exec(`ln -sf "${cliScriptPath}" "${linkPath}"`, {
                        name: 'Photon',
                    });
                    return;
                } catch (_error) {
                    error = (_error as any[])[0];
                }
            } else if (result.response === 1) {
                clipboard.writeText(
                    `sudo ln -sf "${cliScriptPath}" "${linkPath}"`
                );
            }
        }
        throw error;
    }
};

const addBinToUserPath = () => {
    return new Promise<void>((resolve, reject) => {
        try {
            const binPath = path.join(
                app.getAppPath(),
                '..',
                '..',
                'resources',
                'bin'
            );

            const envKey = Registry.openKey(
                Registry.HKCU,
                'Environment',
                Registry.Access.ALL_ACCESS
            );

            if (!envKey) return;

            const items = Registry.enumValueNames(envKey);
            const pathItem = items.find(
                (item) => item.toUpperCase() === 'PATH'
            );
            const pathItemName = pathItem || 'PATH';

            if (pathItem) {
                const type = Registry.queryValueRaw(envKey, pathItem)!.type;

                if (
                    type !== Registry.ValueType.SZ &&
                    type !== Registry.ValueType.EXPAND_SZ
                ) {
                    reject(new Error('Unknown registry type'));
                }

                const value = Registry.queryValue(envKey, pathItem) as string;
                const pathParts = value.split(';');

                if (pathParts.includes(binPath)) {
                    reject(new Error('Photon CLI is already in PATH'));
                }

                pathParts.push(binPath);

                Registry.setValueRaw(
                    envKey,
                    pathItemName,
                    type,
                    Registry.formatString(pathParts.join(';'))
                );
                Registry.closeKey(envKey);
            }

            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export async function installCLI() {
    const platform = process.platform;
    console.log('Trying to install the CLI.');

    switch (platform) {
        case 'win32': {
            try {
                await addBinToUserPath();
            } catch (error) {
                console.log(error);
            }

            break;
        }

        case 'linux' || 'darwin': {
            try {
                await addSymlink();
                console.error(
                    'Photon CLI installed.',
                    `Unsupported platform ${process.platform}`
                );
            } catch (error) {
                console.error('Photon CLI installation failed', `${error}`);
            }
            break;
        }

        default: {
            console.error(
                'Photon CLI installation failed.',
                `Unsupported platform ${process.platform}`
            );
            break;
        }
    }
}
