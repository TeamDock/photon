import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import App from './App';
import { Taskbar } from './components/Taskbar';

import 'react-toastify/dist/ReactToastify.css';

const { ipcRenderer } = window.require('electron');
function AppRender() {
    const [title, setTitle] = useState<string>('0.2.2-beta');

    ipcRenderer.on('terminal.info', (e, data) => {
        setTitle(data.bin);
    });
    return (
        <>
            <Taskbar title={title} />
            <ToastContainer />
            <App />
        </>
    );
}

ReactDOM.render(<AppRender />, document.getElementById('__app'));
