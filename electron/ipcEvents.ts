import { ipcMain, BrowserWindow } from "electron";
import { exec } from 'child_process'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    ipcMain.handle('runCode', async (event, ...args) => {
        const pathFile = args[0];
        const relativePath = '../SimpleLang/Simple.exe';
        const absolutePath = path.resolve(__dirname, relativePath); 
    
        return new Promise((resolve, reject) => {
            exec(`${absolutePath} "${pathFile}"`, (err, stdout, stderr) => {
                if (err) {
                    resolve({ error: err.message });
                    return;
                }
    
                if (stderr) {
                    resolve({ stderr });
                    return;
                }
    
                resolve({ stdout });
            });
        });
    });
}


export default events