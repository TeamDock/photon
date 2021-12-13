import { win } from './main';

export default function () {
    snapResize();

    win.on('maximize', sendWindowResized);
    win.on('unmaximize', sendWindowResized);
    win.on('resized', sendWindowResized);

    win.on('resized', snapResize);

    function sendWindowResized() {
        win.webContents.send('window.resized');
    }

    function snapResize() {
        const sizes = win.getSize();
        const width = round(sizes[0], 10);
        const height = round(sizes[1], 22);

        win.setSize(width, height);
    }
}

function round(n: number, r: number) {
    return Math.round(n / r) * r;
}
