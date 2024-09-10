import './Codespace.scss';
import TextareaAutosize from 'react-textarea-autosize';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { editOriginalText, editText } from './selectedFileSlice';
import { editOpenedFileText, saveChanges } from '../OpenedFiles/openedFilesSlice';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import '../../regex/prism-simple'
import Hints from '../Hints/Hints';
import { def, math, type, time, exception, system } from '../../helpers/defaultSimple';

const fs = require('fs');

function Codespace() {
    const [zoom, setZoom] = useState({ fontSize: 1.04, lineHeight: 1.6 });
    const selectedFile = useSelector((state: RootState) => state.selectedFile);
    const dispatch = useDispatch();
    const [lines, setLines] = useState([1]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);
    const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
    const [currentLineState, setCurrentLineState] = useState('');

    const onChange = (e: Event) => {
        const element = e.target as HTMLInputElement
        const value = element.value

        dispatch(editText(value));
        dispatch(editOpenedFileText({ text: value, path: selectedFile.path }));

        const newLines = [];
        for (let i = 1; i <= value.split('\n').length; i++) {
            newLines.push(i);
        }
        setLines(newLines);
        if (codeRef.current) {
            codeRef.current.innerHTML = Prism.highlight(value, Prism.languages.simple, 'simple');
        }

        const getCurrentLineText = () => {
            if (textareaRef.current) {
                const cursorPosition = textareaRef.current.selectionStart;
                const textBeforeCursor = value.slice(0, cursorPosition);
                const currentLineIndex = textBeforeCursor.split('\n').length - 1;
                const currentLineText = value.split('\n')[currentLineIndex];
                
                setCurrentLineState(currentLineText);
                return currentLineText;
            }
            setCurrentLineState('')
            return '';
        }

        getCurrentLineText()

        if (textareaRef.current) {
            const { top, left } = textareaRef.current.getBoundingClientRect();
            const cursorPos = textareaRef.current.selectionStart;
            const textBeforeCursor = value.slice(0, cursorPos);
            const linesBeforeCursor = textBeforeCursor.split('\n');
            const currentLine = linesBeforeCursor[linesBeforeCursor.length - 1];

            const lineHeight = parseFloat(getComputedStyle(textareaRef.current).lineHeight);
            const cursorX = left + currentLine.length * (zoom.fontSize * 10);
            const cursorY = top + (linesBeforeCursor.length - 1) * lineHeight;

            setCursorPosition({ top: cursorY + 10, left: cursorX + 10 });
        }
    }

    const handleSelectSuggestion = (suggestion: string) => {
        if (textareaRef.current && cursorPosition.top !== 0) {
            const cursorPosition = textareaRef.current.selectionStart;
            const textBeforeCursor = selectedFile.text.slice(0, cursorPosition);
            const textAfterCursor = selectedFile.text.slice(cursorPosition);
    
            const lastWordMatch = textBeforeCursor.match(/(\S+)$/);
            const lastWordIndex = lastWordMatch ? lastWordMatch.index : cursorPosition;
    
            const newText = textBeforeCursor.slice(0, lastWordIndex) + suggestion + textAfterCursor;

            let updatedText = newText;

            const importsMap = {
                'math': 'import Math;',
                'type': 'import Type;',
                'time': 'import Time;',
                'exception': 'import Exception;',
                'system': 'import System;'
            };

            if (math.includes(suggestion) && !updatedText.includes(importsMap.math)) {
                updatedText = importsMap.math + '\n' + updatedText;
            }
            if (type.includes(suggestion) && !updatedText.includes(importsMap.type)) {
                updatedText = importsMap.type + '\n' + updatedText;
            }
            if (time.includes(suggestion) && !updatedText.includes(importsMap.time)) {
                updatedText = importsMap.time + '\n' + updatedText;
            }
            if (exception.includes(suggestion) && !updatedText.includes(importsMap.exception)) {
                updatedText = importsMap.exception + '\n' + updatedText;
            }
            if (system.includes(suggestion) && !updatedText.includes(importsMap.system)) {
                updatedText = importsMap.system + '\n' + updatedText;
            }
    
            dispatch(editText(updatedText));
            dispatch(editOpenedFileText({ text: newText, path: selectedFile.path }));
    
            const newCursorPosition = lastWordIndex! + suggestion.length;
            textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
            textareaRef.current.focus();
            setCursorPosition({ top: 0, left: 0 })
        }
    };

    useEffect(() => {
        const newLines = [];
        for (let i = 1; i <= selectedFile.originalText.split('\n').length; i++) {
            newLines.push(i);
        }
        setLines(newLines);
    }, [selectedFile.originalText]);

    useEffect(() => {
        const textarea: HTMLTextAreaElement = textareaRef.current!;
        const tabulation = (e: KeyboardEvent) => {
            if (e.keyCode === 9 && cursorPosition.top == 0) {
                e.preventDefault();
                const start = textarea?.selectionStart;
                const end = textarea?.selectionEnd;
                const value = textarea?.value;

                textarea.value = value?.substring(0, start) + "\t" + value?.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 1;

                dispatch(editText(textarea.value));
                dispatch(editOpenedFileText({ text: textarea.value, path: selectedFile.path }));
            }
        };

        const saveFile = (e: KeyboardEvent) => {
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

        const zoomIn = (e: KeyboardEvent) => {
            if(e.keyCode === 187 && e.ctrlKey) {
                if(zoom.fontSize < 3.72) {
                    e.preventDefault();
                    setZoom({ fontSize: zoom.fontSize * 1.2, lineHeight: zoom.lineHeight })
                }
            }
        }

        const zoomOut = (e: KeyboardEvent) => {
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
            codeRef.current.innerHTML = Prism.highlight(selectedFile.text, Prism.languages.simple, 'simple');
        }
    }, [selectedFile.text]);

    useEffect(() => {
        const textarea: HTMLTextAreaElement = textareaRef.current!;
    
        const handleBrackets = (e: KeyboardEvent) => {
            interface bracketsMapInterface {
                '(': string;
                '{': string;
                '[': string;
                '"': string;
                "'": string;
            }

            const bracketsMap: bracketsMapInterface = {
                '(': ')',
                '{': '}',
                '[': ']',
                '"': '"',
                "'": "'"
            };
    
            const openBracket = e.key as keyof bracketsMapInterface;
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

    useEffect(() => {
        const textarea: HTMLTextAreaElement = textareaRef.current!;
        const pre = codeRef.current;
    
        const syncScroll = () => {
            if (pre) {
                pre.scrollLeft = textarea.scrollLeft;
            }
        };
    
        if (textarea) {
            textarea.addEventListener('scroll', syncScroll);
        }
    
        return () => {
            if (textarea) {
                textarea.removeEventListener('scroll', syncScroll);
            }
        };
    }, [dispatch, selectedFile.path, selectedFile.text, zoom]);

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
                                onChange={(e: any) => onChange(e)}
                                className='textarea'
                                ref={textareaRef}
                                spellCheck={false}
                                style={{ fontSize: zoom.fontSize + 'vw', lineHeight: zoom.lineHeight }}
                                onBlur={() => setTimeout(() => setCursorPosition({ top: 0, left: 0 }), 100)}
                                onClick={() => setCursorPosition({ top: 0, left: 0 })}
                            />
                        </div>
                    </>
                    :
                    <div className='title_div'>
                        <h1>&gt;</h1>
                        <h2>_</h2>
                    </div>
            }
            <Hints cursorPosition={cursorPosition} currentLine={currentLineState} handleSelectSuggestion={handleSelectSuggestion} />
        </div>
    )
}

export default Codespace;


            {/* <input type='file' className='file_space' onChange={getFile} ref={codeSpace} onClick={(e) => e.preventDefault()} /> */}