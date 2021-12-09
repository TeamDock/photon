module.exports = function (win) {
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
};
/**
 *
 * @param {Number} n
 * @param {Number} r
 * @returns A Number rounded on multiple of r variable
 */
function round(n, r) {
    return Math.round(n / r) * r;
}
