import { useDispatch, useSelector } from 'react-redux';
import './Hints.scss'
import { RootState } from '../../app/store';
import { useEffect } from 'react';

function Hints() {
    const dispatch = useDispatch();
    const functions = ['print', 'println', 'func', 'struct'];
    let userFunctions: string[] = [];
    const file = useSelector((state: RootState) => state.selectedFile);
    const lines = file.text.split('\n');
    useEffect(() => {
        if(file.path) {
            for(let i = 0; i < lines.length; i++) {
                const name = lines[i].split('func' || 'const' || 'struct')[1];
                const variable = lines[i].split('=')[0];
                console.log(name);
                console.log(variable);
            }
        }
    }, [file.text, file.path, dispatch]);

    return (
        <div>

        </div>
    )
}

export default Hints