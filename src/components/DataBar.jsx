
import './DataBar.css'
import RotationText from './RotationText'

export default function DataBar ({dimension, scramble, solution}) {


    return <section>
        <div className='container'>
            <div className='dimension-text'>
                <h2>Dimension</h2>
                <p>{""+dimension[0]+"x"+dimension[1]+"x"+dimension[2]}</p>
            </div>
            <div className='rotation-text'>
                <h2>Scramble</h2>
                <RotationText data={scramble}/>
            </div>
            <div className='rotation-text'>
                <h2>Solution</h2>
                <RotationText data={solution}/>
            </div>
        </div>
    </section>
}