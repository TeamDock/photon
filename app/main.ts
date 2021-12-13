import path from 'path';
import fs from 'fs';
import { copySync } from 'fs-extra';
import isDev from 'electron-is-dev';
import { initialize, enable } from '@electron/remote/main';
import { BrowserWindow, app, ipcMain } from 'electron';
import ptyProcess from './ptyProcess';
import resize from './resize';

initialize();

let win: BrowserWindow;

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
        icon: path.join(__dirname, '..', 'assets', 'Icon.png'),
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
}

app.on('ready', () => {
    createWindow();

    if (
        !fs.existsSync(
            path.join(
                app.getPath('appData'),
                'photon',
                'themes',
                'default',
                'theme.json'
            )
        )
    ) {
        installDefaultTheme();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

function installDefaultTheme() {
    copySync(
        path.join(__dirname, 'themes', 'default'),
        path.join(app.getPath('appData'), 'photon', 'themes', 'default')
    );
}

export { win };
