import { useDispatch, useSelector } from 'react-redux'
import './SideBar.scss'
import { RootState } from '../../app/store'
import { setSelectedFile } from '../Codespace/selectedFileSlice';
import { setOpenedFiles } from '../OpenedFiles/openedFilesSlice';
const fs = require('fs')

interface FileInterface {
    name: string;
    path: string;
}

function SideBar() {
    const dispatch = useDispatch();
    const folder = useSelector((state: RootState) => state.folder);
    const openedFiles = useSelector((state: RootState) => state.openedFiles);

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
    }

    return(
        <div className='sidebar'>
            {folder.name ? <h1>{folder.name}</h1> : <h1>No folder selected</h1>}
            {folder.files.map(file => <button key={file.path} onClick={() => getFile(file)}><div>S</div>{file.name}</button>)}
        </div>
    )
}

export default SideBar