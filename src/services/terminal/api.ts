import path from 'path';
import fs from 'fs';
// import axios from 'axios';

import { ThemeType } from '../../../@types/theme';
import { ITerminalOptions } from 'xterm';
import { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';

const { app } = window.require('@electron/remote');

function useCurrentTheme(themeName: string) {
    const themesDir = path.join(app.getPath('appData'), 'photon', 'Themes');
    const [theme, setTheme] = useState<ITerminalOptions>();
    const currentThemePath = path.join(themesDir, themeName);

    useEffect(() => {
        if (!fs.existsSync(currentThemePath)) {
            const defaultTheme = loadDefaultTheme();
            setTheme(defaultTheme);
            toast(`Cannot find ${themeName} theme. Loading default theme`, {
                progressStyle: {
                    backgroundColor: defaultTheme?.theme?.cursor,
                },
                theme: 'dark',
                icon: IoMdClose,
            });
            return;
        }
        setTheme(loadTheme(path.join(themesDir, themeName)));
    }, [themeName]);

    return theme;
}

function loadDefaultTheme() {
    const themesDir = path.join(app.getPath('appData'), 'photon', 'Themes');
    return loadTheme(path.join(themesDir, 'default-theme'));
}

function loadTheme(themePath: string) {
    const themeJSONPath = path.join(themePath, 'theme.json');

    const theme = JSON.parse(
        fs.readFileSync(themeJSONPath).toString()
    ) as ThemeType;

    if (theme.css) {
        const cssPath =
            path.resolve(theme.css) === path.normalize(theme.css) // is absolute or relative path
                ? theme.css
                : path.join(themePath, theme.css);

        const cssFile = fs.readFileSync(cssPath).toString();

        const head = document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.id = `themeStyle-${theme.name}-${theme.version}`;
        style.innerHTML = cssFile;

        head.appendChild(style);
    }

    const body = document.getElementsByTagName('body')[0];

    if (theme.theme.background) {
        body.style.background = theme.theme.background;
    }

    if (theme.taskbar) {
        const taskbar = document.getElementById('taskbar');

        if (taskbar) {
            if (theme.taskbar.background) {
                taskbar.style.background = theme.taskbar.background;
            }

            if (theme.taskbar.color) {
                taskbar.style.color = theme.taskbar.color;
            }
        }
    }

    return {
        theme: theme.theme,
        // Cursor
        cursorStyle: theme.cursor?.style,
        cursorWidth: theme.cursor?.width,
        cursorBlink: theme.cursor?.blink,
        // Fonts
        fontFamily: theme.font?.family,
        fontSize: theme.font?.size,
        fontWeight: theme.font?.weight,
        fontWeightBold: theme.font?.weightBold,
    } as ITerminalOptions;
}

export { useCurrentTheme };
