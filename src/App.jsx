
import { useState } from 'react'
import './App.css'
import CubeRender from './components/CubeRender'
import DataBar from './components/DataBar'
import solveAndSimplify from './util/SolveAndSimplify'

export default function App() {
  const [rotationData, setRotationData] = useState([])
  const [dimensions, setDimensions] = useState([3, 3, 3])

  const setDimensionsWrapper = (dimensions) => {
    setDimensions(dimensions)
    setRotationData([])
  }

  const {scramble, solution, changed} = solveAndSimplify(rotationData)
  if (changed) {
    setRotationData(scramble)
  }

  return (
    <div id='app-container'>
      <div id='cube-container' key={dimensions.join('')}>
        <CubeRender dimensions={dimensions} rotationData={scramble} setRotationData={setRotationData} />
      </div>
      <aside id='data-container' >
        <DataBar dimensions={dimensions} setDimensions={setDimensionsWrapper} scramble={scramble} solution={solution} />
      </aside>
    </div>
  )
}
