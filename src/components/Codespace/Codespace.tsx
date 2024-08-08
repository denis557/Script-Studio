import './Codespace.scss'
import TextareaAutosize from 'react-textarea-autosize';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { editOriginalText, editText, setSelectedFile } from './selectedFileSlice';
import { editOpenedFileText, saveChanges, setOpenedFiles } from '../OpenedFiles/openedFilesSlice';
const fs = require('fs');

function Codespace() {
    const selectedFile = useSelector((state: RootState) => state.selectedFile);
    const dispatch = useDispatch();
    const [lines, setLines] = useState(['1']);
    const textareaRef = useRef(null);
    const codeSpace = useRef(null);

    const [zoom, setZoom] = useState({ fontSize: 1.04, lineHeight: 1.6 });

    const getFile = (e) => {
        const files = e.target.files[0];
        fs.readFile(files.path, 'utf-8', (err: string, data: string) => {
            if(err) throw err;

            dispatch(setSelectedFile({ name: files.name, path: files.path, originalText: data, text: data, isEdited: false }));
            dispatch(setOpenedFiles({ name: files.name, path: files.path, originalText: data, text: data, isEdited: false }));
        });
    }

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
        const textarea =  textareaRef.current;
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

        const zoomIn = (e) => {
            if(e.keyCode === 187 && e.ctrlKey) {
                if(zoom.fontSize < 3.72) {
                    e.preventDefault();
                    setZoom({ fontSize: zoom.fontSize * 1.2, lineHeight: zoom.lineHeight })
                }
            }
        }

        const zoomOut = (e) => {
            if(e.keyCode === 189 && e.ctrlKey) {
                if(zoom.fontSize > 0.55) {
                    e.preventDefault();
                    setZoom({ fontSize: zoom.fontSize / 1.2, lineHeight: zoom.lineHeight })
                }
            }   
        }

        document.addEventListener('keydown', saveFile);
        document.addEventListener('keydown', zoomIn);
        document.addEventListener('keydown', zoomOut);

        return () => {
            document.removeEventListener('keydown', saveFile);
            document.removeEventListener('keydown', zoomIn);
            document.removeEventListener('keydown', zoomOut);
        }
    }, [dispatch, selectedFile.path, selectedFile.text, zoom]);


    return(
        <div className='codespace'>
            {/* <input type='file' className='file_space' onChange={getFile} ref={codeSpace} onClick={(e) => e.preventDefault()} /> */}
            {
                selectedFile.path ?
                    <>
                        <div className="line-numbers" style={{ fontSize: zoom.fontSize + 'vw', lineHeight: zoom.lineHeight }}>
                            {lines.map(line => (
                                <span style={{ height: zoom.lineHeight + 'em' }} key={line}>{line}</span>
                            ))}
                        </div>
                        <TextareaAutosize
                            value={selectedFile.text} 
                            onChange={(e) => onChange(e)} 
                            className='textarea' 
                            ref={textareaRef} 
                            style={{ fontSize: zoom.fontSize + 'vw', lineHeight: zoom.lineHeight }}
                        />
                    </>
                :
                    <h1>No file selected</h1>
            }
        </div>
    )
}

export default Codespace