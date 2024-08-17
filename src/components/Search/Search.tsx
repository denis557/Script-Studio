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

interface SearchProps {
    input: string;
    closeMenu: () => void;
}

function Search ({ input, closeMenu }: SearchProps) {
    const folder = useSelector((state: RootState) => state.folder);
    const openedFiles = useSelector((state: RootState) => state.openedFiles);
    const menuRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    let files = [...folder.files];

    folder.folders.forEach(folderEl => folderEl.files.forEach(fileEl => files.push(fileEl)))

    const checkExtension = (array: string[], file: FileInterface) => {
        for(let i = 0; i < array.length; i++) {
            if(file.name.split('.').pop() === array[i]) {
                return true
            }
        }

        return false
    }
    
    const getFile = (file: FileInterface) => {
        const fileCopy = file;
        
        if (checkExtension(['exe', 'dll', 'lib', 'bat', 'app', 'apk', 'bin', 'x86', 'x64'], fileCopy)) return

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
        function handleClickOutside(e: Event) {
            if (menuRef.current && !menuRef.current?.contains(e.target as Node)) {
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
                    files.map((file) => file.name.includes(input) ?
                        <button key={file.path} onClick={() => getFile(file)}>
                            <div>S</div>
                            {file.name}
                            <span>{file.path}</span>
                        </button>
                    : '')
                :
                    files.map(file => 
                        <button key={file.path} onClick={() => getFile(file)}>
                            <div>S</div>
                            {file.name}
                            <span>{file.path}</span>
                        </button>
                    )
            :
                <div className='search_title'>
                    <p>No folder selected</p>
                </div>
            }
        </div>
    )
}

export default Search