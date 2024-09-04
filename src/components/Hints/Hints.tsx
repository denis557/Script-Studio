import { useDispatch, useSelector } from 'react-redux';
import './Hints.scss'
import { RootState } from '../../app/store';
import { useEffect, useState } from 'react';
import def from '../../helpers/defaultSimple.ts'

function Hints({ cursorPosition, currentLine }) {
    const dispatch = useDispatch();
    const file = useSelector((state: RootState) => state.selectedFile);
    const lines = file.text.split('\n');
    const splittedCurrentLine = currentLine.trim().split(' ');
    const [userFunctions, setUserFunctions] = useState(new Set());

    useEffect(() => {
        if(file.path) {
            for(let i = 0; i < lines.length; i++) {
                console.log('works')
                if(lines[i].includes('func') || lines[i].includes('struct')) {
                    const name = lines[i].split('func' || 'struct');
                    let func: string[] | string = name[name.length - 1].split('(');
                    if(func.length === 1) {
                        const result = name[name.length - 1].split(' ')[1];
                        setUserFunctions(prev => new Set(prev.add(result)));
                    } else {
                        const result = name[name.length - 1].split('(')[0].trim();
                        setUserFunctions(prev => new Set(prev.add(result)));
                    }
                }

                if(lines[i].includes('=')) {
                    const varFirstSplit = lines[i].split('=')[0].split(' ');
                    const variable = varFirstSplit[varFirstSplit.length - 2];
                    setUserFunctions(prev => new Set(prev.add(variable)));
                }
            }
        }
    }, [file.text, file.path, dispatch]);

    return (
        <div className='hints' style={{ top: cursorPosition.top, left: cursorPosition.left, display: cursorPosition.top !== 0 ? 'flex' : 'none' }}>
            {def.map(el => el.includes(splittedCurrentLine[splittedCurrentLine.length - 1]) ? <p>{el}</p> : '')}
            {[...userFunctions].map(el => el.includes(splittedCurrentLine[splittedCurrentLine.length - 1]) ? <p>{el}</p> : '')}
        </div>
    )
}

export default Hints