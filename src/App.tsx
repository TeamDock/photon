// React
import React, { useEffect, useState } from 'react';

import './globals.scss';
import styles from './App.module.scss';

// Components
import { PhotonTerminal } from './services/terminal';

function App() {
    return (
        <div className={styles.wrapper}>
            <PhotonTerminal />
        </div>
    );
}

export default App;
