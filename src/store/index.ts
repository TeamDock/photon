import { JSONSchemaType } from 'json-schema-typed';
import StoreType from 'electron-store';
import path from 'path';
import { ElectronRemote } from '../@types/electron/remote';

const Store = window.require('electron-store') as typeof StoreType;
const { app } = window.require('@electron/remote') as ElectronRemote;
const os = window.require('os');

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
    cwd: path.join(app.getPath('appData'), 'photon', 'config'),
});

export { schema, config };
