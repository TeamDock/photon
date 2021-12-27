import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

// xterm
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

// store
import { useConfig } from '../../hooks/useTheme';

import { useCurrentTheme } from './api';

const { ipcRenderer } = window.require('electron');

function PhotonTerminal() {
    const terminalShell = useConfig('shell');

    // -- Shell
    useEffect(() => {
        ipcRenderer.send('terminal.shell', terminalShell);
    }, [terminalShell]);

    const configTheme = useConfig('photonTheme');
    console.log(configTheme);
    const [theme, setCurrentTheme] = useState(useCurrentTheme(configTheme));
    const [term] = useState(new Terminal(theme));

    // -- Theme

    useEffect(() => {
        const currentTheme = useCurrentTheme(configTheme);
        setCurrentTheme(currentTheme);

        console.log(currentTheme);

        Object.keys(currentTheme).forEach((option) => {
            type OptionKey = keyof typeof currentTheme;
            term.setOption(option, currentTheme[option as OptionKey]);
        });
    }, [configTheme]);

    useEffect(() => {
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

    // -- xterm

    useEffect(() => {
        const xterm = document.querySelector('.xterm-viewport');

        xterm?.setAttribute('class', 'xterm-viewport terminal-screen');
    }, []);

    return <div id="terminal" className={styles.wrapper} />;
}

export { PhotonTerminal };
