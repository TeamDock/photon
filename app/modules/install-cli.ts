// Based on https://github.com/vercel/hyper/blob/canary/app/utils/cli-install.ts

import * as Registry from 'native-reg';
import path from 'path';
import { app } from '../main';

const addBinToUserPath = () => {
    return new Promise<void>((resolve, reject) => {
        try {
            const binPath = path.resolve(app.getAppPath(), 'bin');

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
                    return;
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
                console.error(error);
            }

            break;
        }

        // case 'linux' || 'darwin': {
        //     try {
        //         await addSymlink();
        //         console.error(
        //             'Photon CLI installed.',
        //             `Unsupported platform ${process.platform}`
        //         );
        //     } catch (error) {
        //         console.error('Photon CLI installation failed', `${error}`);
        //     }
        //     break;
        // }

        default: {
            console.error(
                'Photon CLI installation failed.',
                `Unsupported platform ${process.platform}`
            );
            break;
        }
    }
}
