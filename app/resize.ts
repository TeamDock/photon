import { win } from './main';
import { getCurrentTheme } from './utils/getCurrentTheme';

export default function () {
    snapResize();

    win.on('maximize', sendWindowResized);
    win.on('unmaximize', sendWindowResized);
    win.on('resized', () => {
        sendWindowResized();
        snapResize();
    });

    function sendWindowResized() {
        win.webContents.send('window.resized');
    }

    function snapResize() {
        const currentTheme = getCurrentTheme();
        const fontSize = currentTheme?.font?.size;

        const sizes = win.getSize();
        const width = round(sizes[0], fontSize ? fontSize / 2 + 2 : 20);
        const height = round(sizes[1], fontSize ? fontSize + 5 : 20);

        win.setSize(width, height);
    }
}

function round(n: number, r: number) {
    return Math.round(Math.round(n / r) * r);
}
