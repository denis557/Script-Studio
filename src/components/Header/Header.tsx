import './Header.scss'
import Controls from '../Controls/Controls';
import { Run } from '../../assets/header/Run';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedFile } from '../Codespace/selectedFileSlice';
import { useRef } from 'react';
import { setOpenedFiles } from '../OpenedFiles/openedFilesSlice';
import { ipcRenderer } from 'electron';
import { RootState } from '../../app/store';
const fs = require('fs')

function Header() {
    const dispatch = useDispatch();
    const selectedFile = useSelector((state: RootState) => state.selectedFile);
    const fileRef = useRef(null)

    const getFile = (e) => {
        const files = e.target.files[0];
        console.log(files)

        fs.readFile(files.path, 'utf-8', (err: string, data: string) => {
            if(err) throw err;

            dispatch(setSelectedFile({ name: files.name, path: files.path, originalText: data, text: data, isEdited: false }));
            dispatch(setOpenedFiles({ name: files.name, path: files.path, originalText: data, text: data, isEdited: false }));
        });
    }

    const handleRun = async () => {
        if (!selectedFile.path) {
            console.log('Выбери файл гад')
        } else if (selectedFile.name.split('.')[1] == 'txt' || selectedFile.name.split('.')[1] == 'simple') {
            await ipcRenderer.invoke('runCode', selectedFile.path);
        } else {
            console.log('Неправильный формат гад')
        }
    }

    return(
        <div className='header'>
            <div className='header_buttons'>
                <input type='file' onChange={getFile} ref={fileRef} />
                <button onClick={() => fileRef.current?.click()}>
                    File
                </button>
                <button>
                    Terminal
                </button>
                <button>
                    View
                </button>
                <button>
                    Git
                </button>
            </div>
            <div className='header_run_search'>
                <button onClick={handleRun}><Run /></button>
                <input placeholder='Search - Calculator' />
            </div>
            <Controls />
        </div>
    );
}

export default Header