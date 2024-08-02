import './Controls.scss'
import { useState } from 'react'
import { ipcRenderer } from 'electron';
import { Minimize } from '../../assets/controls/Minimize'
import { Restore } from '../../assets/controls/Restore';
import { Maximize } from '../../assets/controls/Maximize';
import { Close } from '../../assets/controls/Close';

function Controls() {
    const [isMaximized, setIsMaximized] = useState(true);

    const handleClick = async(action: string) => {
        await ipcRenderer.invoke('windowAction', action);
        if(action === 'maximize') setIsMaximized(!isMaximized);
    }

    return(
        <div className='controls'>
            <button onClick={() => handleClick('minimize')}>
                <Minimize />
            </button>
            <button onClick={() => handleClick('maximize')}>
                {isMaximized ? <Restore /> : <Maximize />}
            </button>
            <button onClick={() => handleClick('close')}>
                <Close />
            </button>
        </div>
    )
}

export default Controls