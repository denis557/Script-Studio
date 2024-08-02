import { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import './Codespace.scss'
import { useDispatch, useSelector } from 'react-redux';
import { editText } from './selectedFileSlice';
import { RootState } from '../../app/store';
import { editOpenedFileText } from '../OpenedFiles/openedFilesSlice';

function Codespace() {
    const selectedFile = useSelector((state: RootState) => state.selectedFile);
    const dispatch = useDispatch();
    const [lines, setLines] = useState(['1']);

    const onChange = (e) => {
        dispatch(editText(e.target.value));
        dispatch(editOpenedFileText({ text: e.target.value, path: selectedFile.path }))
        const newLines = [];
        for (let i = 1; i <= e.target.value.split('\n').length; i++) {
            newLines.push(i);
        }
        setLines(newLines);
    }

    useEffect(() => {
        const newLines = [];
        for (let i = 1; i <= selectedFile.originalText.split('\n').length; i++) {
            newLines.push(i);
        }
        setLines(newLines);
    }, [selectedFile.originalText])

    return(
        <div className='codespace'>
            {
                selectedFile.originalText ?
                    <>
                        <div className="line-numbers">
                            {lines.map(line => (
                                <span key={line}>{line}</span>
                            ))}
                        </div>
                        <TextareaAutosize value={selectedFile.text} onChange={(e) => onChange(e)} className='textarea' />
                    </>
                :
                    <h1>No file selected</h1>
            }
        </div>
    )
}

export default Codespace