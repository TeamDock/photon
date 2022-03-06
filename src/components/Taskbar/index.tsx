import React, { useCallback, useMemo } from 'react';
import styles from './styles.module.scss';
import os from 'os';
import { useConfig } from '../../hooks/useConfig';

import {
    HiX,
    HiMinus,
    HiOutlineDuplicate,
    HiOutlineMenu,
} from 'react-icons/hi';

const { getCurrentWindow } = window.require('@electron/remote');

type TaskbarProps = {
    title?: string;
};

function Taskbar({ title }: TaskbarProps) {
    // -- Taskbar functions
    const currentWindow = getCurrentWindow();
    const closeWindow = useCallback(() => {
        currentWindow.close();
    }, []);

    const maxWindow = useCallback(() => {
        const isOSX = os.platform() === 'darwin';

        if (isOSX) {
            return currentWindow.setFullScreen(!currentWindow.isFullScreen());
        }

        if (currentWindow.isMaximized()) {
            currentWindow.unmaximize();
        } else {
            currentWindow.maximize();
        }
    }, []);

    const minWindow = useCallback(() => {
        const window = getCurrentWindow();

        window.minimize();
    }, []);

    const useMacOSWindowActionButtons = useConfig(
        'useMacOSWindowActionButtons'
    );

    const shouldUseMacOSWindowActions = useMemo(() => {
        return useMacOSWindowActionButtons || os.platform() === 'darwin';
    }, [useMacOSWindowActionButtons]);

    return (
        <div id="taskbar" className={styles.wrapper}>
            <div className={styles.start}>
                {/* {!shouldUseMacOSWindowActions && (
                    <button className={styles.menu}>
                        <HiOutlineMenu size="20" />
                    </button>
                )} */}

                {shouldUseMacOSWindowActions && (
                    <div className={styles.macOSButtons}>
                        <button
                            className={styles.macOSbutton}
                            onClick={minWindow}
                            style={{ background: '#E96379' }}
                        ></button>

                        <button
                            className={styles.macOSbutton}
                            onClick={maxWindow}
                            style={{ background: '#E7DE79' }}
                        ></button>

                        <button
                            className={styles.macOSbutton}
                            onClick={closeWindow}
                            style={{ background: '#67E480' }}
                        ></button>
                    </div>
                )}
            </div>

            <div className={styles.middle}>
                <p>Photon {title && title !== '' ? `- ${title}` : ''}</p>
            </div>

            <div className={styles.end}>
                {/* {shouldUseMacOSWindowActions && (
                    <button className={styles.menu}>
                        <HiOutlineMenu size="20" />
                    </button>
                )} */}

                {!shouldUseMacOSWindowActions && (
                    <div className={styles.buttons}>
                        <button className={styles.button} onClick={minWindow}>
                            <HiMinus size="20" />
                        </button>

                        <button className={styles.button} onClick={maxWindow}>
                            <HiOutlineDuplicate size="20" />
                        </button>

                        <button className={styles.button} onClick={closeWindow}>
                            <HiX size="20" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export { Taskbar };
