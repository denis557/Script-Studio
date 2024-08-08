import { useDispatch, useSelector } from 'react-redux'
import './Search.scss'
import { RootState } from '../../app/store'
import { setSelectedFile } from '../Codespace/selectedFileSlice';
import { setOpenedFiles } from '../OpenedFiles/openedFilesSlice';
import { useEffect, useRef } from 'react';
const fs = require('fs')

interface FileInterface {
    name: string;
    path: string;
}

function Search({ input, closeMenu }) {
    const folder = useSelector((state: RootState) => state.folder);
    const openedFiles = useSelector((state: RootState) => state.openedFiles);
    const menuRef = useRef(null);
    const dispatch = useDispatch();
    
    const getFile = (file: FileInterface) => {
        fs.readFile(file.path, 'utf-8', (err: string, data: string) => {
            if(err) throw err;

            if(openedFiles.openedFiles.some(element => element.path === file.path)) {
                dispatch(setSelectedFile({ name: file.name, path: file.path, originalText: data, text: data, isEdited: false }));
            } else {
                dispatch(setSelectedFile({ name: file.name, path: file.path, originalText: data, text: data, isEdited: false }));
                dispatch(setOpenedFiles({ name: file.name, path: file.path, originalText: data, text: data, isEdited: false }));
            }
        });
        closeMenu();
    }

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                closeMenu();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    return (
        <div className='search' ref={menuRef}>
            {folder.name ?
                input ? 
                    folder.files.map(file => file.name.includes(input) ? <button onClick={() => getFile(file)}><div>S</div>{file.name}</button> : '')
                :
                    folder.files.map(file => <button onClick={() => getFile(file)}><div>S</div>{file.name}</button>)
            :
                <p>No folder selected</p>}
        </div>
    )
}

export default Search