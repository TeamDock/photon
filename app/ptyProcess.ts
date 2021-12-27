import { win } from './main';
import { IPty, spawn } from 'node-pty';
import { app, ipcMain } from 'electron';

type ptyProcessProps = {
    app: typeof app;
    ipcMain: typeof ipcMain;
};

export default function ({ app, ipcMain }: ptyProcessProps) {
    let ptyProcess: IPty;

    ipcMain.on('terminal.shell', (e, shell) => {
        if (ptyProcess) ptyProcess.kill();
        ptyProcess = spawn(shell, [], {
            name: 'photon-terminal',
            cols: 80,
            rows: 24,
            cwd: process.cwd(),
        });

        ptyProcess.onData((e) => {
            win.webContents.send('terminal.incData', e);
        });

        ipcMain.on('terminal.toTerm', (e, data) => {
            ptyProcess.write(data);
        });

        ipcMain.on('terminal.resize', (e, data) => {
            ptyProcess.resize(data.cols, data.rows);
        });
    });
}
