import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Taskbar } from './components/Taskbar';

function AppRender() {
    return (
        <>
            <Taskbar title="0.2.0-beta" />
            <App />
        </>
    );
}

ReactDOM.render(<AppRender />, document.getElementById('__app'));
