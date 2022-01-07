import path from 'path';
import fs from 'fs';
import { copySync } from 'fs-extra';
import isDev from 'electron-is-dev';
import { initialize, enable } from '@electron/remote/main';
import { BrowserWindow, app, ipcMain } from 'electron';
import ptyProcess from './ptyProcess';
import resize from './resize';
import { installCLI } from './install-cli';
import { appDataDefaultThemeJson, themesPath } from './utils/paths';
import { ThemeType } from '../@types/theme';

initialize();

let win: BrowserWindow;

const themeJson = JSON.parse(
    fs
        .readFileSync(path.join(themesPath, 'default-theme', 'theme.json'))
        .toString()
) as ThemeType;

if (!fs.existsSync(appDataDefaultThemeJson)) {
    installDefaultTheme();
} else if (
    (
        JSON.parse(
            fs.readFileSync(appDataDefaultThemeJson).toString()
        ) as ThemeType
    ).version !== themeJson.version
)
    installDefaultTheme();
function createWindow() {
    win = new BrowserWindow({
        width: 1116,
        height: 624,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            plugins: true,
            sandbox: false,
        },
        icon: path.join(__dirname, '..', 'assets', 'icon.png'),
        minWidth: 200,
        minHeight: 100,
    });

    enable(win.webContents);
    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, 'renderer', 'index.html')}`
    );

    if (isDev) win.webContents.openDevTools({ mode: 'detach' });

    // Modules
    ptyProcess({ app, ipcMain });
    resize();
    if (!isDev) installCLI();
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('quit', () => {
    app.quit();
});

function installDefaultTheme() {
    console.log('Installing theme');

    fs.mkdirSync(path.join(app.getPath('appData'), 'photon', 'Themes'), {
        recursive: true,
    });

    copySync(
        path.join(themesPath, 'default-theme'),
        path.join(app.getPath('appData'), 'photon', 'Themes', 'default-theme')
    );
}

export { win, app };
