import React, { useEffect } from 'react';
import styles from './styles.module.scss';
import { useCurrentTheme } from '../ThemeController';

// xterm
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

// store
import { config } from '../../store';

const { ipcRenderer } = window.require('electron');

function PhotonTerminal() {
    useEffect(() => {
        ipcRenderer.send('terminal.shell', config.get('shell'));
    }, []);

    useEffect(() => {
        // xterm
        const theme = useCurrentTheme();
        const term = new Terminal({
            theme: theme?.theme,
            cursorWidth: theme?.cursor?.width,
            cursorStyle: 'bar',
            fontFamily: theme?.font?.fontFamily,
            fontSize: theme?.font?.fontSize,
        });

        // Addons
        const fitAddon = new FitAddon();
        const weblinks = new WebLinksAddon();

        term.loadAddon(fitAddon);
        term.loadAddon(weblinks);

        // ---

        const terminalElement = document.getElementById('terminal');

        if (terminalElement) {
            term.open(terminalElement);
            fitAddon.fit();
            ipcRenderer.send('terminal.resize', fitAddon.proposeDimensions());

            term.onData((e) => {
                ipcRenderer.send('terminal.toTerm', e);
            });

            ipcRenderer.on('terminal.incData', function (e, data) {
                term.write(data);
            });
        }

        // ---
        ipcRenderer.on('window.resized', resize);

        function resize() {
            fitAddon.fit();
            ipcRenderer.send('terminal.resize', fitAddon.proposeDimensions());
        }
    }, []);

    useEffect(() => {
        const xterm = document.querySelector('.xterm-viewport');

        xterm?.setAttribute('class', 'xterm-viewport terminal-screen');
    }, []);

    return <div id="terminal" className={styles.wrapper} />;
}

export { PhotonTerminal };
