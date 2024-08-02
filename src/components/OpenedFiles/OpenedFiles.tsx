import './OpenedFiles.scss'
import { CloseFile } from '../../assets/selectedFiles/CloseFile'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { editOriginalText, setSelectedFile } from '../Codespace/selectedFileSlice';
import { closeFile, saveChanges } from './openedFilesSlice';
const fs = require('fs')

interface FileInterface {
    name: string;
    path: string;
    originalText: string;
    text: string;
    isEdited: boolean;
}

function OpenedFiles() {
    const selectedFile = useSelector((state: RootState) => state.selectedFile);
    const openedFiles = useSelector((state: RootState) => state.openedFiles);
    const dispatch = useDispatch();

    const updateFile = (file: FileInterface) => {
        fs.writeFile(file.path, file.text, (err: string) => {
            if (err) {
              console.error(err);
            } else {
              console.log('updated');
              dispatch(editOriginalText(file.text));
              dispatch(saveChanges({ text: file.text, path: file.path }))
            }
          });
    }

    const handleCloseFile = (file: FileInterface) => {
        if(selectedFile.path === file.path) {
            dispatch(setSelectedFile({ name: '', path: '', originalText: '', text: '', isEdited: file.isEdited }))
        }
        dispatch(closeFile(file.path));
    }

    const handleOpenFile = (file: FileInterface) => {
        dispatch(setSelectedFile({ name: file.name, path: file.path, originalText: file.originalText, text: file.text, isEdited: file.isEdited })); 
    }

    return(
        <div className='openedFiles'>
            {
                openedFiles.openedFiles.map(file => 
                    <button key={file.path} className={`${selectedFile.path === file.path ? 'selected' : ''}`} onClick={() => handleOpenFile(file)}>
                        {file.name}
                        <button onClick={(e) => {handleCloseFile(file); e.stopPropagation();}}><CloseFile /></button>
                        {file.isEdited ? <button onClick={() => updateFile(file)}>Save</button> : 'net'}
                    </button>)
            }
        </div>
    )
}

export default OpenedFiles
