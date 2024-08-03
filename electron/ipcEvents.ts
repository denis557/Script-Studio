import { ipcMain, BrowserWindow } from "electron";
import { exec } from 'child_process'

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

    ipcMain.handle('runCode', (event, ...args) => {
        const path = args[0];

        exec(`D:/JS/ScriptStudio/SimpleLang/Simple.exe "${path}"`, (err, stdout, stderr) => {
            if(err) {
                console.log(err);
                return
            }

            if(stderr) {
                console.log(stderr);
                return
            }

            console.log(stdout);
        })
    })
}


export default events