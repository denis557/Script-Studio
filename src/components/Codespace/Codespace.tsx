import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import './Codespace.scss'
import { useDispatch, useSelector } from 'react-redux';
import { editOriginalText, editText } from './selectedFileSlice';
import { RootState } from '../../app/store';
import { editOpenedFileText, saveChanges } from '../OpenedFiles/openedFilesSlice';
const fs = require('fs')

function Codespace() {
    const selectedFile = useSelector((state: RootState) => state.selectedFile);
    const dispatch = useDispatch();
    const [lines, setLines] = useState(['1']);
    const textareaRef = useRef(null);

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

    useEffect(() => {
        const textarea = textareaRef.current;
        const tabulation = (e) => {
            if (e.keyCode === 9) {
                e.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;

                textarea.value = value.substring(0, start) + "\t" + value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 1;

                dispatch(editText(textarea.value));
                dispatch(editOpenedFileText({ text: textarea.value, path: selectedFile.path }));
            }
        };

        textarea?.addEventListener('keydown', tabulation);

        return () => {
            textarea?.removeEventListener('keydown', tabulation);
        };
    }, [dispatch, selectedFile.path]);

    useEffect(() => {
        const saveFile = (e) => {
            if(e.keyCode === 83 && e.ctrlKey) {
                e.preventDefault();
                if(selectedFile.originalText !== selectedFile.text) {
                    fs.writeFile(selectedFile.path, selectedFile.text, (err: string) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log('updated');
                            dispatch(editOriginalText(selectedFile.text));
                            dispatch(saveChanges({ text: selectedFile.text, path: selectedFile.path }))
                        }
                    });
                }
            }
        }

        document.addEventListener('keydown', saveFile);

        return () => {
            document.removeEventListener('keydown', saveFile);
        }
    }, [dispatch, selectedFile.path]);

    return(
        <div className='codespace'>
            {
                selectedFile.path ?
                    <>
                        <div className="line-numbers">
                            {lines.map(line => (
                                <span key={line}>{line}</span>
                            ))}
                        </div>
                        <TextareaAutosize value={selectedFile.text} onChange={(e) => onChange(e)} className='textarea' ref={textareaRef} />
                    </>
                :
                    <h1>No file selected</h1>
            }
        </div>
    )
}

export default Codespace