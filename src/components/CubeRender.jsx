import { Canvas } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import './CubeRender.css'
import CubeMesh from './CubeMesh'
import CubeControls from './CubeControls'
import { Dimensions } from '../util/Dimensions'

export default function CubeRender({dimensions=[3, 3, 3]}) {
    dimensions = new Dimensions(dimensions) // cast to dimensions object
    
    return (
        <div id='canvas-container'>
            <Canvas camera={{position: [1, 1, 1]}}>
                <OrbitControls enablePan={false} />
                <Stats />
                <ambientLight intensity={1}/>
                <CubeMesh dimensions={dimensions}/>
                <CubeControls dimensions={dimensions}/>
            </Canvas>
        </div>
    )
}