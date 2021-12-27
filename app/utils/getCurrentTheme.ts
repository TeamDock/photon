import getAppDataPath from 'appdata-path';
import path from 'path';
import fs from 'fs';
import { ThemeType } from '../../@types/theme';

function getCurrentTheme() {
    const themesPath = path.join(getAppDataPath(), 'photon', 'Themes');
    const configPath = path.join(getAppDataPath(), 'photon', 'Config');
    let currentTheme: string;
    if (fs.existsSync(path.join(configPath, 'config.json'))) {
        currentTheme = JSON.parse(
            fs.readFileSync(path.join(configPath, 'config.json')).toString()
        ).photonTheme as string;
    } else {
        currentTheme = 'default-theme';
    }

    const themesFolder = fs.readdirSync(themesPath);

    for (let i = 0; i < themesFolder.length; i++) {
        const themeFolder = themesFolder[i];

        if (themeFolder === currentTheme) {
            return JSON.parse(
                fs
                    .readFileSync(
                        path.join(themesPath, themeFolder, 'theme.json')
                    )
                    .toString()
            ) as ThemeType;
        } else if (currentTheme === 'default-theme') {
            return JSON.parse(
                fs
                    .readFileSync(
                        path.join(themesPath, 'default-theme', 'theme.json')
                    )
                    .toString()
            ) as ThemeType;
        }
    }

    return null;
}

export { getCurrentTheme };
