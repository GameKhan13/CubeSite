
import './DataBar.css'
import RotationText from './RotationText'

export default function DataBar ({dimensions, setDimensions, scramble, solution}) {


    return <div id='data-bar'>
        <div className='dimension-section'>
            <h2>Dimension</h2>
            <DimensionDisplay dimensions={dimensions} setDimensions={setDimensions} />
        </div>
        <div className='rotation-section'>
            <h2>Scramble</h2>
            <RotationText data={scramble}/>
        </div>
        <div className='rotation-section'>
            <h2>Solution</h2>
            <RotationText data={solution}/>
        </div>
    </div>
}

function DimensionDisplay ({dimensions, setDimensions}) {
    return <div id='dimension-fields'>
        <div className='dimension-column'>
            <DimensionIncrimenter 
            dimensions={dimensions} 
            setDimensions={setDimensions} 
            index={0}
            />
            {dimensions[0]}
            <DimensionDecrimenter 
            dimensions={dimensions}
            setDimensions={setDimensions} 
            index={0}
            />
        </div>
        <div className='dimension-column'>
            X
        </div>
        <div className='dimension-column'>
            <DimensionIncrimenter 
            dimensions={dimensions} 
            setDimensions={setDimensions} 
            index={1}
            />
            {dimensions[1]}
            <DimensionDecrimenter 
            dimensions={dimensions}
            setDimensions={setDimensions} 
            index={1}
            />
        </div>
        <div className='dimension-column'>
            X
        </div>
        <div className='dimension-column'>
            <DimensionIncrimenter 
            dimensions={dimensions} 
            setDimensions={setDimensions} 
            index={2}
            />
            {dimensions[2]}
            <DimensionDecrimenter 
            dimensions={dimensions}
            setDimensions={setDimensions} 
            index={2}
            />
        </div>
    </div>
}

function DimensionIncrimenter ({dimensions, setDimensions, index}) {
    const max = 5
    const incriment = () => {
        const newDimension = dimensions[index] + 1

        if (newDimension <= max) {
            const newDimensions = [...dimensions]
            newDimensions[index] = newDimension
            setDimensions(newDimensions)
        }
    }

    return <button
    onClick={incriment}
    >+</button>
}

function DimensionDecrimenter ({dimensions, setDimensions, index}) {
    const min = 1
    const incriment = () => {
        const newDimension = dimensions[index] - 1

        if (newDimension >= min) {
            const newDimensions = [...dimensions]
            newDimensions[index] = newDimension
            setDimensions(newDimensions)
        }
    }

    return <button
    onClick={incriment}
    >-</button>
}