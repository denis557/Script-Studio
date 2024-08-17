import { useDispatch, useSelector } from 'react-redux'
import './Terminal.scss'
import { RootState } from '../../app/store'

function Terminal() {
    const output = useSelector((state: RootState) => state.output);

    return (
        <div className='terminal'>
            <div className='terminal-header'>
                <h1>Terminal</h1>
            </div>
            {output.output && <pre className='output'>{output.output}</pre>}
        </div>
    )
}

export default Terminal