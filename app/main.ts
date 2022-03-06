import path from 'path';
import fs from 'fs';
import { copySync } from 'fs-extra';
import isDev from 'electron-is-dev';
import { initialize, enable } from '@electron/remote/main';
import { BrowserWindow, app, ipcMain } from 'electron';
import ptyProcess from './modules/ptyProcess';
import resize from './modules/resize';
import { installCLI } from './modules/install-cli';
import { appDataDefaultThemeJson, themesPath } from './utils/paths';
import { ThemeType } from '../@types/theme';
import { initRenderer } from 'electron-store';

initialize();
initRenderer();

let win: BrowserWindow;

console.log('Checking default-theme');
const themeJson = JSON.parse(
    fs
        .readFileSync(path.join(themesPath, 'default-theme', 'theme.json'))
        .toString()
) as ThemeType;

if (
    !fs.existsSync(appDataDefaultThemeJson) ||
    (
        JSON.parse(
            fs.readFileSync(appDataDefaultThemeJson).toString()
        ) as ThemeType
    ).version !== themeJson.version
) {
    installDefaultTheme();
}

console.log('Disabling Chromium GPU blacklist');
app.commandLine.appendSwitch('ignore-gpu-blacklist');

// console.log('Disabling Hardware acceleration');
// app.disableHardwareAcceleration();

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

    if (isDev) win.webContents.openDevTools({ mode: 'detach' });

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, 'renderer', 'index.html')}`
    );

    enable(win.webContents);

    // Modules
    ptyProcess(ipcMain);
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
    console.log('Installing default-theme');

    fs.mkdirSync(path.join(app.getPath('appData'), 'photon', 'Themes'), {
        recursive: true,
    });

    copySync(
        path.join(themesPath, 'default-theme'),
        path.join(app.getPath('appData'), 'photon', 'Themes', 'default-theme')
    );
}

export { win, app };
