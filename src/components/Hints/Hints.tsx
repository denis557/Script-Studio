import { useDispatch, useSelector } from 'react-redux';
import './Hints.scss'
import { RootState } from '../../app/store';
import { FC, useEffect, useState } from 'react';
import { def, math, type, time, exception, system } from '../../helpers/defaultSimple';

interface CursorPositionInterface {
    top: number,
    left: number
}

interface HintsProps {
    cursorPosition: CursorPositionInterface;
    currentLine: string;
    handleSelectSuggestion: (suggestion: string) => void;
}

const Hints: FC<HintsProps> = ({ cursorPosition, currentLine, handleSelectSuggestion }) => {
    const dispatch = useDispatch();
    const file = useSelector((state: RootState) => state.selectedFile);
    const lines = file.text.split('\n');
    const splittedCurrentLine = currentLine.trim().split(' ');
    const [userFunctions, setUserFunctions] = useState(new Set<string>());
    const [activeIndex, setActiveIndex] = useState(0);

    const suggestions = [...def, ...math, ...type, ...time, ...exception, ...system, ...userFunctions].filter(el =>
        el.includes(splittedCurrentLine[splittedCurrentLine.length - 1])
    );

    const generateImportWarning = (hint: string) => {
        const importsMap = {
            'math': 'import Math;',
            'type': 'import Type;',
            'time': 'import Time;',
            'exception': 'import Exception;',
            'system': 'import System;'
        };

        if (math.includes(hint) && !file.text.includes(importsMap.math)) {
            return <span className='warning'>Library Math will be imported</span>
        }
        if (type.includes(hint) && !file.text.includes(importsMap.type)) {
            return <span className='warning'>Library Type will be imported</span>
        }
        if (time.includes(hint) && !file.text.includes(importsMap.time)) {
            return <span className='warning'>Library Time will be imported</span>
        }
        if (exception.includes(hint) && !file.text.includes(importsMap.exception)) {
            return <span className='warning'>Library Exception will be imported</span>
        }
        if (system.includes(hint) && !file.text.includes(importsMap.system)) {
            return <span className='warning'>Library System will be imported</span>
        }

        return ''
    }

    useEffect(() => {
        if (file.path) {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('func') || lines[i].includes('struct')) {
                    const keyword = lines[i].includes('func') ? 'func' : 'struct';
                    const name = lines[i].split(keyword);
                    const funcNameWithParams = name[name.length - 1].trim();
                    const funcName = funcNameWithParams.includes('(') ? funcNameWithParams.split('(')[0].trim() : funcNameWithParams.split('{')[0].trim();
    
                    if ((funcName && funcNameWithParams.includes('(')) || (funcName && funcNameWithParams.includes('{'))) {
                        setUserFunctions(prev => funcName ? new Set(prev.add(funcName)) : new Set(prev));
                    }
                }
    
                if (lines[i].includes('=')) {
                    const varFirstSplit = lines[i].split('=')[0].split(' ');
                    const variable = varFirstSplit[varFirstSplit.length - 2];
                    setUserFunctions(prev => new Set(prev.add(variable)));
                }
            }
        }
    }, [file.text, file.path, dispatch]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (suggestions.length > 0) {
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setActiveIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    setActiveIndex((prevIndex) => (prevIndex - 1 + suggestions.length) % suggestions.length);
                } else if (event.key === 'Tab') {
                    event.preventDefault();
                    handleSelectSuggestion(suggestions[activeIndex]);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeIndex, suggestions, handleSelectSuggestion]);

    return (
        <div className='hints' style={{ top: cursorPosition.top, left: cursorPosition.left, display: cursorPosition.top !== 0 ? 'flex' : 'none' }}>
            {suggestions.map((el, index) => (
                <div
                    key={el}
                    className={index === activeIndex ? 'active' : ''}
                    onClick={() => handleSelectSuggestion(el)}
                >
                    {el.includes('for (') ? 'for'
                    : el.includes('do {') ? 'do' 
                    : el.includes('while (') ? 'while' 
                    : el.includes('struct MyStruct') ? 'struct' 
                    : el.includes('switch') ? 'switch' 
                    : el.includes('func MyFunc ()') ? 'func' 
                    : el.includes('try {') ? 'try' 
                    : el.includes('foreach (') ? 'foreach' 
                    : el.includes('if (') ? 'if' : el}
                    {generateImportWarning(el)}
                </div>
            ))}
        </div>
    )
}

export default Hints