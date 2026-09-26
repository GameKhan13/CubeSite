
import { useState } from 'react'
import './App.css'
import CubeRender from './components/CubeRender'
import DataBar from './components/DataBar'
import solveAndSimplify from './util/SolveAndSimplify'

export default function App() {
  const [rotationData, setRotationData] = useState([])
  const dimension = [3, 3, 3]

  const {scramble, solution, changed} = solveAndSimplify(rotationData)
  if (changed) {
    setRotationData(scramble)
  }

  return (
    <>
      <div id='cube-container'>
        <CubeRender dimensions={dimension} rotationData={scramble} setRotationData={setRotationData} />
        <DataBar dimension={dimension} scramble={scramble} solution={solution} />
      </div>
    </>
  )
}
