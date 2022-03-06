import { win, app } from '../main';
import { IPty, spawn } from 'node-pty';
import { IpcMain } from 'electron';
import findProcess from 'find-process';

export default function (ipcMain: IpcMain) {
    let ptyProcess: IPty;

    ipcMain.on('terminal.shell', (e, shell: string) => {
        disposePTY();
        ptyProcess = spawn(shell, [], {
            name: 'photon-terminal',
            cols: 80,
            rows: 24,
            cwd: process.cwd(),
        });

        findProcess('pid', ptyProcess.pid).then((data) => {
            win.webContents.send('terminal.info', data[0]);
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

    app.on('before-quit', () => {
        disposePTY();
    });

    function disposePTY() {
        if (ptyProcess) {
            ipcMain.removeAllListeners('terminal.toTerm');
            ipcMain.removeAllListeners('terminal.resize');
            ptyProcess.kill();
        }
    }
}
