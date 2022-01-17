import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

// xterm
import { ITerminalOptions, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { WebglAddon } from 'xterm-addon-webgl';
import 'xterm/css/xterm.css';

// store
import { useConfig } from '../../hooks/useTheme';

import { useCurrentTheme } from './api';

const { ipcRenderer, shell } = window.require('electron');

function PhotonTerminal() {
    const terminalShell = useConfig('shell');
    const configTheme = useConfig('photonTheme');

    // -- Shell
    useEffect(() => {
        ipcRenderer.send('terminal.shell', terminalShell);
    }, [terminalShell]);

    // xterm
    const currentTheme = useCurrentTheme(configTheme);
    const [term] = useState<Terminal>(new Terminal(currentTheme));

    useEffect(() => {
        if (!currentTheme) return;
        Object.keys(currentTheme).forEach((option) => {
            type OptionKey = keyof typeof currentTheme;
            term.setOption(option, currentTheme[option as OptionKey]);
        });
    }, [currentTheme]);

    useEffect(() => {
        const fitAddon = new FitAddon();
        const weblinks = new WebLinksAddon((e, uri) => {
            e.preventDefault();

            shell.openExternal(uri);
        });
        const webgl = new WebglAddon();

        term.loadAddon(fitAddon);
        term.loadAddon(weblinks);

        const terminalElement = document.getElementById('terminal');

        if (terminalElement) {
            term.open(terminalElement);
            term.loadAddon(webgl);
            webgl.onContextLoss(() => {
                webgl.dispose();
            });
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
