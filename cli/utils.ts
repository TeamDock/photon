import getAppDataPath from 'appdata-path';
import fs from 'fs';
import path from 'path';

function isThemePath(themePath: string) {
    return fs.existsSync(path.join(themePath, 'theme.json'));
}

function isTheme(theme: string) {
    return fs.existsSync(
        path.join(getAppDataPath(), 'photon', 'Themes', theme, 'theme.json')
    );
}

function isInstalledTheme(theme: string) {
    return fs.existsSync(
        path.join(getAppDataPath(), 'photon', 'Themes', theme)
    );
}

export { isInstalledTheme, isTheme, isThemePath };
