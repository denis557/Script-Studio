import { ipcMain, BrowserWindow } from "electron";

const events = (win: BrowserWindow) => {
    ipcMain.handle('windowAction', (event, ...args) => {
        const action = args[0];

        if(action === 'close') {
            win.close();
            return 'close'
        } else if(action === 'minimize') {
            win.minimize();
            return 'minimize'
        } else if(action === 'maximize') {
            const isMaximized = win.isMaximized();

            if(isMaximized) win.unmaximize();
            else win.maximize();

            return 'maximized'
        }
    })
}


export default events