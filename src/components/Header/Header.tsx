import './Header.scss'
import Controls from '../Controls/Controls';
import { Run } from '../../assets/header/Run';
import { useDispatch } from 'react-redux';
import { setSelectedFile } from '../Codespace/selectedFileSlice';
import { useRef } from 'react';
import { setOpenedFiles } from '../OpenedFiles/openedFilesSlice';
const fs = require('fs')

function Header() {
    const dispatch = useDispatch();
    const fileRef = useRef(null)

    const getFile = (e) => {
        const files = e.target.files[0];

        fs.readFile(files.path, 'utf-8', (err: string, data: string) => {
            if(err) throw err;

            dispatch(setSelectedFile({ name: files.name, path: files.path, originalText: data, text: data, isEdited: false }));
            dispatch(setOpenedFiles({ name: files.name, path: files.path, originalText: data, text: data, isEdited: false }));
        });
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
                <button><Run /></button>
                <input placeholder='Search - Calculator' />
            </div>
            <Controls />
        </div>
    )
}

export default Header