import './Codespace.scss';
import TextareaAutosize from 'react-textarea-autosize';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { editOriginalText, editText } from './selectedFileSlice';
import { editOpenedFileText, saveChanges } from '../OpenedFiles/openedFilesSlice';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import '../../../SimpleLang/regex/prism-simple'

const fs = require('fs');

function Codespace() {
    const [zoom, setZoom] = useState({ fontSize: 1.04, lineHeight: 1.6 });
    const selectedFile = useSelector((state: RootState) => state.selectedFile);
    const dispatch = useDispatch();
    const [lines, setLines] = useState(['1']);
    const textareaRef = useRef(null);
    const codeRef = useRef(null);

    const onChange = (e) => {
        dispatch(editText(e.target.value));
        dispatch(editOpenedFileText({ text: e.target.value, path: selectedFile.path }));
        const newLines = [];
        for (let i = 1; i <= e.target.value.split('\n').length; i++) {
            newLines.push(i);
        }
        setLines(newLines);
        if (codeRef.current) {
            // codeRef.current.innerHTML = Prism.highlight(e.target.value, Prism.languages.javascript, 'javascript');
            codeRef.current.innerHTML = Prism.highlight(e.target.value, Prism.languages.simple, 'simple');
        }
    }

    useEffect(() => {
        const newLines = [];
        for (let i = 1; i <= selectedFile.originalText.split('\n').length; i++) {
            newLines.push(i);
        }
        setLines(newLines);
    }, [selectedFile.originalText]);

    useEffect(() => {
        const textarea =  textareaRef.current;
        const tabulation = (e) => {
            if (e.keyCode === 9) {
                e.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;

                // textarea.value = value.substring(0, start) + "\t" + value.substring(end);
                textarea.value = value.substring(0, start) + "    " + value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 4;

                dispatch(editText(textarea.value));
                dispatch(editOpenedFileText({ text: textarea.value, path: selectedFile.path }));
            }
        };

        const saveFile = (e) => {
            if(e.keyCode === 83 && e.ctrlKey) {
                e.preventDefault();
                if(selectedFile.originalText !== selectedFile.text) {
                    fs.writeFile(selectedFile.path, selectedFile.text, (err: string) => {
                        if (err) {
                            console.error(err);
                        } else {
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
        textarea?.addEventListener('keydown', tabulation);

        return () => {
            document.removeEventListener('keydown', saveFile);
            document.removeEventListener('keydown', zoomIn);
            document.removeEventListener('keydown', zoomOut);
            textarea?.removeEventListener('keydown', tabulation);
        }
    }, [dispatch, selectedFile.path, selectedFile.text, zoom]);

    useEffect(() => {
        if (codeRef.current) {
            // codeRef.current.innerHTML = Prism.highlight(selectedFile.text, Prism.languages.javascript, 'javascript');
            codeRef.current.innerHTML = Prism.highlight(selectedFile.text, Prism.languages.simple, 'simple');
        }
    }, [selectedFile.text]);

    useEffect(() => {
        const textarea = textareaRef.current;
    
        const handleBrackets = (e) => {
            const bracketsMap = {
                '(': ')',
                '{': '}',
                '[': ']',
                '"': '"',
                "'": "'"
            };
    
            const openBracket = e.key;
            const closeBracket = bracketsMap[openBracket];
    
            if (closeBracket) {
                e.preventDefault();
    
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;
    
                textarea.value = value.substring(0, start) + openBracket + closeBracket + value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 1;
    
                dispatch(editText(textarea.value));
                dispatch(editOpenedFileText({ text: textarea.value, path: selectedFile.path }));
            }
        };
    
        textarea?.addEventListener('keydown', handleBrackets);
    
        return () => {
            textarea?.removeEventListener('keydown', handleBrackets);
        };
    }, [dispatch, selectedFile.path, selectedFile.text]);

    return (
        <div className='codespace'>
            {
                selectedFile.path ?
                    <>
                        <div className="line-numbers" style={{ fontSize: zoom.fontSize + 'vw', lineHeight: zoom.lineHeight }}>
                            {lines.map(line => (
                                <span style={{ height: zoom.lineHeight + 'em' }} key={line}>{line}</span>
                            ))}
                        </div>
                        <div className="code-container">
                            <pre className="language-simple" ref={codeRef} style={{ fontSize: zoom.fontSize + 'vw', lineHeight: zoom.lineHeight }}></pre>
                            <TextareaAutosize
                                value={selectedFile.text}
                                onChange={(e) => onChange(e)}
                                className='textarea'
                                ref={textareaRef}
                                spellCheck={false}
                                style={{ fontSize: zoom.fontSize + 'vw', lineHeight: zoom.lineHeight }}
                            />
                        </div>
                    </>
                    :
                    <div className='title_div'>
                        <h1>No file selected</h1>
                    </div>
            }
        </div>
    )
}

export default Codespace;


            {/* <input type='file' className='file_space' onChange={getFile} ref={codeSpace} onClick={(e) => e.preventDefault()} /> */}

                        