import { useSelector } from 'react-redux'
import { Clear } from '../../assets/terminal/Clear'
import { Close } from '../../assets/terminal/Close'
import './Terminal.scss'
import { RootState } from '../../app/store'

function Terminal() {
    const output = useSelector((state: RootState) => state.output);

    return (
        <div className='terminal'>
            <div className='terminal-header'>
                <h1>Terminal</h1>
                <div>
                    <Close />
                    <Clear />
                </div>
            </div>
            {/* {output.output && <p className='output'>{output.output}</p>} */}
            {output.output && <pre className='output'>{output.output}</pre>}
        </div>
    )
}

export default Terminal