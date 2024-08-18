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
    files: ReduxFileInterface[],
    folders: SubFolderInterface[],
    isOpened: boolean
}

interface FileWithPath extends File {
    path: string;
}

function Header() {
    const [search, setSearch] = useState('');
    const [isSearch, setIsSearch] = useState(false)
    const selectedFile = useSelector((state: RootState) => state.selectedFile);
    const openedFiles = useSelector((state: RootState) => state.openedFiles);
    const folder = useSelector((state: RootState) => state.folder);
    const fileRef = useRef<HTMLInputElement>(null);
    const folderRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    const checkExtension = (array: string[], file: File) => {
        for(let i = 0; i < array.length; i++) {
            if(file.name.split('.').pop() === array[i]) {
                return true
            }
        }

        return false
    }

    const getFile = (e: any) => {
        const files = e.target.files[0];
        const fileCopy = files;
        console.log(files)

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

    // const getFolder = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = event.target.files;
    //     console.log(files);

    //     if (!files) return;

    //     const paths = Array.from(files).map((file: FileWithPath) => file.path.split('\\'));
    //     const genericPath = [];

    //     for(let i = 0; i < paths[0].length; i++) {
    //         const currentPath = paths[0][i];
    //         if(paths.every(path => path[i] == currentPath)) {
    //             genericPath.push(currentPath);
    //         } else {
    //             break;
    //         }
    //     }

    //     const updatedFiles: ReduxFileInterface[] = Array.from(files).map(file => {
    //         return {
    //             name: file.name,
    //             path: file.path
    //         }
    //     });

    //     let filesResult: ReduxFileInterface[] = [];
    //     let foldersResult: SubFolderInterface[] = [];

    //     for(let i = 0; i < updatedFiles.length; i++) {
    //         const updatedPath: string = updatedFiles[i].path.split(genericPath.join('\\')).pop()!;
    //         let j = 1;
    //         let firstElement = updatedPath.split('\\')[j];
    //         let isInSubFolder = false;
    //         let isInSubSubFolder = false;

    //         function checkIfFile() {
    //             if(firstElement.split('.')[1]) {
    //                 if(isInSubSubFolder) {

    //                     const firstFolder = foldersResult.find(folderEl => folderEl.name === updatedPath.split('\\')[1]);
    //                     const parentSubFolder = firstFolder?.folders.find(folderEl => folderEl.name === updatedPath.split('\\')[j - 1])
    //                     parentSubFolder?.files.push(updatedFiles[i])

    //                 } else if(!isInSubFolder) {

    //                     filesResult.push(updatedFiles[i]);

    //                 } else if(isInSubFolder) {

    //                     const parentFolder: SubFolderInterface = foldersResult.find(folderEl => folderEl.name === updatedPath.split('\\')[j - 1])!;
    //                     const firstFolder = foldersResult.find(folderEl => folderEl.name === updatedPath.split('\\')[1]);
    //                     const parentSubFolder = firstFolder?.folders.find(folderEl => folderEl.name === updatedPath.split('\\')[j - 1])
    //                     parentFolder.files.push(updatedFiles[i])

    //                 }
    //             } else {
    //                 if(j === 1) {

    //                     const isFolderExists = foldersResult.find(folderEl => folderEl.name === firstElement);
    //                     !isFolderExists && foldersResult.push({ name: firstElement, files: [], folders: [], isOpened: false });
    //                     isInSubFolder = true
    //                     j++;
    //                     firstElement = updatedPath.split('\\')[j]
    //                     checkIfFile();

    //                 } else if(j === 2) {

    //                     const parentFolder = foldersResult.find(folderEl => folderEl.name === updatedPath.split('\\')[j - 1])!;
    //                     const isFolderExists = parentFolder.folders.find(folderEl => folderEl.name === firstElement);
    //                     !isFolderExists && parentFolder.folders.push({ name: firstElement, files: [], folders: [], isOpened: false });
    //                     isInSubFolder = false
    //                     isInSubSubFolder = true;
    //                     j++;
    //                     firstElement = updatedPath.split('\\')[j]
    //                     checkIfFile();
                        
    //                 }
    //                 //  else {
    //                 //     const firstFolder = foldersResult.find(folderEl => folderEl.name === updatedPath.split('\\')[1])!;
                        
    //                 // }
    //             }
    //         }

    //         checkIfFile()
    //     }

    //     dispatch(setFolder({ name: genericPath.pop()!, files: filesResult, folders: foldersResult }))
    //     console.log(foldersResult)

    //     return genericPath.join('\\');
    // };

    interface FolderInterface {
        name: string,
        files: FileInterface[],
        folders: SubFolderInterface[]
    }

    const initialFolderStructure: FolderInterface = {
        name: 'Root',
        files: [],
        folders: []
    };

    function getFolder(e, folderStructure: FolderInterface) {
        const files = e.target.files;

        Array.from(files).forEach(file => {
            const parts = file.webkitRelativePath.split('/');
            let currentFolder = folderStructure;
    
            parts.forEach((part, index) => {
                if (index === parts.length - 1) {
                    currentFolder.files.push({
                        name: file.name,
                        path: file.path,
                    });
                } else {
                    let existingFolder = currentFolder.folders.find(folder => folder.name === part);
                    if (!existingFolder) {
                        existingFolder = {
                            name: part,
                            files: [],
                            folders: [],
                            isOpened: false,
                        };
                        currentFolder.folders.push(existingFolder);
                    }
                    currentFolder = existingFolder;
                }
            });
        });
    
        dispatch(setFolder({ name: folderStructure.folders[0].name, folders: folderStructure.folders[0].folders, files: folderStructure.folders[0].files }));
    }


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
                    // onChange={getFolder} 
                    onChange={(e) => getFolder(e, initialFolderStructure)}
                    ref={folderRef}
                    {...{ webkitdirectory: "true", mozdirectory: "true", msdirectory: "true", odirectory: "true", directory: "true" }}
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