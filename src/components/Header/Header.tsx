import './Header.scss'
import Controls from '../Controls/Controls';
import { Run } from '../../assets/header/Run';
import { useDispatch, useSelector } from 'react-redux';
import { editOriginalText, setSelectedFile } from '../Codespace/selectedFileSlice';
import { useRef, useState } from 'react';
import { saveChanges, setOpenedFiles } from '../OpenedFiles/openedFilesSlice';
import { ipcRenderer } from 'electron';
import { RootState } from '../../app/store';
import { setOutput } from '../Terminal/outputSlice';
import { setFolder } from '../SideBar/selectedFolderSlice';
import Search from '../Search/Search';
const fs = require('fs')

interface FileInterface {
    path: string;
    text: string;
}

interface ReduxFileInterface {
    name: string;
    path: string;
}

interface SubFolderInterface {
    name: string,
    files: FileInterface[],
    folders: SubFolderInterface[],
    isOpened: boolean
}

function Header() {
    const [search, setSearch] = useState('');
    const [isSearch, setIsSearch] = useState(false)
    const selectedFile = useSelector((state: RootState) => state.selectedFile);
    const openedFiles = useSelector((state: RootState) => state.openedFiles);
    const folder = useSelector((state: RootState) => state.folder);
    const output = useSelector((state: RootState) => state.output);
    const fileRef = useRef(null);
    const folderRef = useRef(null);
    const dispatch = useDispatch();

    const checkExtension = (array, file) => {
        for(let i = 0; i < array.length; i++) {
            if(file.name.split('.').pop() === array[i]) {
                return true
            }
        }

        return false
    }

    const getFile = (e) => {
        const files = e.target.files[0];
        const fileCopy = files;

        if (checkExtension(['exe', 'dll', 'lib', 'bat', 'app', 'apk', 'bin', 'x86', 'x64'], fileCopy)) return

        fs.readFile(files.path, 'utf-8', (err: string, data: string) => {
            if(err) throw err;

            if(openedFiles.openedFiles.some(element => element.path === files.path)) {
                dispatch(setSelectedFile({ name: files.name, path: files.path, originalText: data, text: data, isEdited: false }));
            } else {
                dispatch(setSelectedFile({ name: files.name, path: files.path, originalText: data, text: data, isEdited: false }));
                dispatch(setOpenedFiles({ name: files.name, path: files.path, originalText: data, text: data, isEdited: false }));
            }
        });
    }

    const updateFile = (file: FileInterface) => {
        fs.writeFile(file.path, file.text, (err: string) => {
            if (err) {
              console.error(err);
            } else {
              dispatch(editOriginalText(file.text));
              dispatch(saveChanges({ text: file.text, path: file.path }))
            }
        });
    }

    const handleRun = async () => {
        if (!selectedFile.path) {
            dispatch(setOutput("Select a file"))
        } else if (selectedFile.name.split('.')[1] == 'txt' || selectedFile.name.split('.')[1] == 'simple') {
            if(selectedFile.originalText !== selectedFile.text) updateFile({ path: selectedFile.path, text: selectedFile.text });

            	const result = await ipcRenderer.invoke('runCode', selectedFile.path);
            if (result.error) {
                dispatch(setOutput(result.error))
            } else if (result.stderr) {
                dispatch(setOutput(result.stderr))
            } else {
                dispatch(setOutput(result.stdout))
            }
        } else {
            dispatch(setOutput("Invalid extension"))
        }
    }

    const getFolder = (event) => {
        const files = event.target.files;

        const paths = Array.from(files).map(file => file.path.split('\\'));
        const genericPath = [];

        for(let i = 0; i < paths[0].length; i++) {
            const currentPath = paths[0][i];
            if(paths.every(path => path[i] == currentPath)) {
                genericPath.push(currentPath);
            } else {
                break;
            }
        }

        const updatedFiles = Array.from(files).map(file => {
            return {
                name: file.name,
                path: file.path
            }
        });

        let filesResult: SubFolderInterface[] = [];
        let foldersResult: SubFolderInterface[] = [];

        for(let i = 0; i < updatedFiles.length; i++) {
            const updatedPath = updatedFiles[i].path.split(genericPath.join('\\')).pop();
            let j = 1;
            let firstElement = updatedPath.split('\\')[j];
            console.log(firstElement)
            let isInSubFolder = false;
            function checkIfFile() {
                if(firstElement.split('.')[1]) {
                    if(!isInSubFolder) {
                        filesResult.push(updatedFiles[i]);
                    } else {
                        const parentFolder = foldersResult.find(folderEl => folderEl.name === updatedPath.split('\\')[j - 1]);
                        parentFolder.files.push(updatedFiles[i])
                    }
                } else {
                    const isFolderExists = foldersResult.find(folderEl => folderEl.name === firstElement);
                    !isFolderExists && foldersResult.push({ name: firstElement, files: [], folders: [], isOpened: false });
                    isInSubFolder = true
                    j++;
                    firstElement = updatedPath.split('\\')[j]
                    checkIfFile();
                }
            }
            checkIfFile()
        }

        dispatch(setFolder({ name: genericPath.pop(), files: filesResult, folders: foldersResult }))

        return genericPath.join('\\');
    };

    const closeMenu = () => {
        setIsSearch(false)
    }

    return(
        <div className='header'>
            <div className='header_buttons'>
                <input type='file' className='file_inpuit' onChange={getFile} ref={fileRef} />
                <button onClick={() => fileRef.current?.click()}>
                    File
                </button>
                {/* <button>
                    Terminal
                </button> */}
                <button onClick={() => folderRef.current?.click()}>
                    {/* View */}
                    Folder
                </button>
                <input 
                    className='file_inpuit'
                    type="file" 
                    webkitdirectory="true" 
                    mozdirectory="true" 
                    msdirectory="true" 
                    odirectory="true" 
                    directory="true"
                    onChange={getFolder} 
                    ref={folderRef}
                />
                {/* <button>
                    Git
                </button> */}
            </div>
            <div className='header_run_search'>
                <button onClick={handleRun}><Run /></button>
                <input placeholder={`Search ${folder.name ? '- ' + folder.name : ''}`} onClick={() => setIsSearch(true)} onChange={e => setSearch(e.target.value)} value={search} />
            </div>
            <Controls />
            {isSearch && <Search input={search} closeMenu={closeMenu} />}
        </div>
    );
}

export default Header