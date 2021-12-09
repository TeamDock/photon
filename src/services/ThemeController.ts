import path from 'path';

// --
import { config, schema } from '../store';
import { ITheme } from 'xterm';

// --
import { ElectronRemote } from '../@types/@electron/remote';

const { app } = window.require('@electron/remote') as ElectronRemote;
const fs = window.require('fs');

type ThemeType = {
    name: string;
    author: string;
    version: string;
    theme: ITheme;
    cursor?: {
        width?: number;
    };
    font?: {
        fontFamily?: string;
        fontSize?: number;
    };
    css?: string;
};

type IThemeType = ThemeType & {
    path: string;
};

export function useCurrentTheme() {
    const configTheme = config.get('photonTheme');
    const themesFolder = path.join(app.getPath('appData'), 'photon', 'themes');

    fs.mkdirSync(themesFolder, { recursive: true });

    const themeFolder = fs.readdirSync(themesFolder);

    if (configTheme === 'defaulttheme') {
        return loadDefaultTheme();
    }

    for (let i = 0; i < themeFolder.length; i++) {
        const theme = themeFolder[i];

        const themeFiles = fs.readdirSync(path.join(themesFolder, theme));

        for (let o = 0; o < themeFiles.length; o++) {
            const themeFile = themeFiles[o];

            if (themeFile === 'theme.json') {
                const themeJSON = JSON.parse(
                    fs
                        .readFileSync(path.join(themesFolder, theme, themeFile))
                        .toString()
                ) as ThemeType;

                if (configTheme === themeJSON.name) {
                    return loadTheme({
                        ...themeJSON,
                        path: path.join(themesFolder, theme, themeFile),
                    });
                }
            } else if (themeFiles.length - 1 === o) {
                return loadDefaultTheme();
            }
        }
    }
}

function loadDefaultTheme() {
    const themesFolder = path.join(app.getPath('appData'), 'photon', 'themes');
    const defaultThemePath = path.join(themesFolder, 'default', 'theme.json');

    const defaultTheme = JSON.parse(fs.readFileSync(defaultThemePath));

    const theme = defaultTheme as ThemeType;
    return loadTheme({
        ...theme,
        path: path.join(defaultThemePath, '..'),
    });
}

function loadTheme(theme: IThemeType) {
    if (theme.css) {
        const cssPath =
            path.resolve(theme.css) === path.normalize(theme.css) // is absolute or relative path
                ? theme.css
                : path.join(theme.path, theme.css);

        const cssFile = fs.readFileSync(cssPath).toString();

        const head = document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.innerHTML = cssFile;

        head.appendChild(style);
    }

    const body = document.getElementsByTagName('body')[0];

    if (theme.theme.background) {
        body.style.background = theme.theme.background;
    }

    return theme as ThemeType;
}
