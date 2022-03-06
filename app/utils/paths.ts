import path from 'path';
import { app } from 'electron';
import isDev from 'electron-is-dev';

const appDataDefaultThemeJson = path.join(
    app.getPath('appData'),
    'photon',
    'Themes',
    'default-theme',
    'theme.json'
);

const themesPath = isDev
    ? path.join(__dirname, '..', 'app', 'themes')
    : path.join(__dirname, '..', '..', 'themes');

export { appDataDefaultThemeJson, themesPath };
