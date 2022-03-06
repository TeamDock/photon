import { JSONSchemaType } from 'json-schema-typed';
import path from 'path';
import Store from 'electron-store';
import os from 'os';
import getAppDataPath from 'appdata-path';

const schema = {
    useMacOSWindowActionButtons: {
        type: JSONSchemaType.Boolean,
        default: false,
    },
    photonTheme: {
        type: JSONSchemaType.String,
        default: 'default-theme',
    },

    shell: {
        type: JSONSchemaType.String,
        default: os.platform() === 'win32' ? 'cmd.exe' : 'bash',
    },
};

const config = new Store({
    schema,
    watch: true,
    configFileMode: 0o666,
    cwd: path.join(getAppDataPath('photon'), 'config'),
});

export { schema, config };
