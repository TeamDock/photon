// Based on https://github.com/vercel/hyper/blob/canary/app/utils/cli-install.ts

import * as Registry from 'native-reg';
import path from 'path';
import { app } from './main';

const addBinToUserPath = () => {
    const binPath = path.join(app.getAppPath(), 'resources', 'bin');

    const envKey = Registry.openKey(
        Registry.HKCU,
        'Environment',
        Registry.Access.ALL_ACCESS
    );

    if (!envKey) return;

    const items = Registry.enumValueNames(envKey);
    const pathItem = items.find((item) => item.toUpperCase() === 'PATH');
    const pathItemName = pathItem || 'PATH';

    if (pathItem) {
        const type = Registry.queryValueRaw(envKey, pathItem)!.type;

        if (
            type !== Registry.ValueType.SZ &&
            type !== Registry.ValueType.EXPAND_SZ
        ) {
            return {
                error: 'Unknown registry type',
            };
        }

        const value = Registry.queryValue(envKey, pathItem) as string;
        const pathParts = value.split(';');

        if (pathParts.includes(binPath)) {
            return {
                error: 'Photon CLI is already in PATH',
            };
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
};

export function installCLI() {
    const platform = process.platform;

    switch (platform) {
        case 'win32': {
            addBinToUserPath();

            break;
        }

        case 'linux' || 'darwin': {
            break;
        }

        default: {
            break;
        }
    }
}
