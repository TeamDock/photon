import { app, Notification } from 'electron';

function Notify(body: string, title = 'Photon') {
    if (app.isReady()) {
        createNotification(title, body);
    } else {
        app.on('ready', () => {
            createNotification(title, body);
        });
    }
}

function createNotification(title: string, body: string) {
    new Notification({
        body,
        title,
    }).show();
}

export default Notify;
