const path = require('path');
const fs = require('fs');
const { copySync } = require('fs-extra');
const isDev = require('electron-is-dev');
const remote = require('@electron/remote/main');
const { BrowserWindow, app, ipcMain } = require('electron');
const ptyProcess = require('./ptyProcess');
const resize = require('./resize');

remote.initialize();

function createWindow() {
    const win = new BrowserWindow({
        width: 1116,
        height: 624,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            plugins: true,
        },
        icon: path.join(__dirname, '..', '..', 'assets', 'Icon.png'),
        minWidth: 200,
        minHeight: 100,
    });

    remote.enable(win.webContents);
    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../../build/index.html')}`
    );

    if (isDev) win.webContents.openDevTools({ mode: 'detach' });

    // Modules
    ptyProcess({ app, ipcMain, win });
    resize(win);
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
