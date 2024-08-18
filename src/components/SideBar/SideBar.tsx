import { useDispatch, useSelector } from 'react-redux'
import './SideBar.scss'
import { RootState } from '../../app/store'
import { setSelectedFile } from '../Codespace/selectedFileSlice';
import { setOpenedFiles } from '../OpenedFiles/openedFilesSlice';
import { Folder } from '../../assets/sidebar/Folder';
import { changeFolderState } from './selectedFolderSlice';
import { OpenedFolder } from '../../assets/sidebar/OpenedFolder';
import { ReactElement } from 'react';
const fs = require('fs')

interface FileInterface {
    name: string;
    path: string;
}

interface SubFolderInterface {
    name: string,
    files: FileInterface[],
    folders: SubFolderInterface[],
    isOpened: boolean
}

interface FolderInterface {
    name: string,
    files: FileInterface[],
    folders: SubFolderInterface[]
}

function SideBar() {
    const dispatch = useDispatch();
    const folder = useSelector((state: RootState) => state.folder);
    const openedFiles = useSelector((state: RootState) => state.openedFiles);

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
    }

    const renderFolder = (folder: any): ReactElement => {
        return (
            <>
                {folder.isOpened !== undefined && 
                    <button key={folder.name} onClick={() => dispatch(changeFolderState(folder.name))}>
                        {folder.isOpened ? <OpenedFolder /> : <Folder />}
                        <span>{folder.name}</span>
                    </button>
                }
                {folder.isOpened === undefined && 
                    folder.folders.map((folderEl: SubFolderInterface) => 
                        renderFolder(folderEl)
                    )
                }
                {folder.isOpened && (
                    <div>
                        {folder.folders.map((subFolder: SubFolderInterface) => renderFolder(subFolder))}
                        {folder.files.map((file: FileInterface) => (
                            <button key={file.name} className="fileInFolder" onClick={() => getFile(file)}>
                                {file.name}
                            </button>
                        ))}
                    </div>
                )}
                {folder.isOpened === undefined && 
                    folder.files.map((file: FileInterface) => 
                        <button key={file.path} onClick={() => getFile(file)}>
                            <p>{file.name}</p>
                        </button>
                    )
                }
            </>
        );
    };

    return(
        <div className='sidebar'>
            {folder.name ? <h1>{folder.name}</h1> : <h1>No folder selected</h1>}
            {renderFolder(folder)}
        </div>
    )
}

export default SideBar


// {folder.folders.map(folderEl => 
//     <>
//         <button key={folderEl.files[0].path} onClick={() => dispatch(changeFolderState(folderEl.name))}>
//             {folderEl.isOpened ? <OpenedFolder /> : <Folder />}
//             <p>{folderEl.name}</p>
//         </button>
//         {folderEl.isOpened &&
//         <div key={folderEl.files[0].path}>
//             {folderEl.files.map(file => 
//                 <button key={file.path} onClick={() => getFile(file)} className='fileInFolder'>
//                     {file.name.split('.')[1] === 'simple' && <div>S</div>}
//                     <p>{file.name}</p>
//                 </button>
//             )}
//         </div>}
//     </>
// )}
// {folder.files.map(file => 
//     <button key={file.path} onClick={() => getFile(file)}>
//         {file.name.split('.')[1] === 'simple' && <div>S</div>}
//         <p>{file.name}</p>
//     </button>
// )}