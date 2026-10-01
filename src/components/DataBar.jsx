
import './DataBar.css'

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

function RotationText ({data}) {
    return <p>
        {data.map((notation, index) => {
            return (index===0?"":", ") + notation.toString()
        })}
    </p>
}

function DimensionDisplay ({dimensions, setDimensions}) {
    return <div id='dimension-fields'>
        <DimensionColumn 
        dimensions={dimensions}
        setDimensions={setDimensions}
        index={0}
        />
        <div className='dimension-column'>X</div>
        <DimensionColumn 
        dimensions={dimensions}
        setDimensions={setDimensions}
        index={1}
        />
        <div className='dimension-column'>X</div>
        <DimensionColumn 
        dimensions={dimensions}
        setDimensions={setDimensions}
        index={2}
        />
    </div>
}

function DimensionColumn({dimensions, setDimensions, index}) {
    return <div className='dimension-column'>
        <DimensionChangeButton 
        dimensions={dimensions}
        setDimensions={setDimensions} 
        index={index}
        delta={1}
        >+</DimensionChangeButton>
        {dimensions[index]}
        <DimensionChangeButton 
        dimensions={dimensions}
        setDimensions={setDimensions} 
        index={index}
        delta={-1}
        >-</DimensionChangeButton>
    </div>
}

function DimensionChangeButton({dimensions, setDimensions, index, delta, children}) {
    const max = 5
    const min = 1
    const change = () => {
        const newDimension = dimensions[index] + delta

        if (newDimension <= max && newDimension >= min) {
            const newDimensions = [...dimensions]
            newDimensions[index] = newDimension
            setDimensions(newDimensions)
        }
    }

    return <button
    onClick={change}
    >{children}</button>
}