import { Canvas } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import './CubeRender.css'
import CubeMesh from './CubeMesh'

export default function CubeRender() {
    
    
    return (
        <div id='canvas-container'>
            <Canvas camera={{position: [1, 1, 1]}}>
                <OrbitControls enablePan={false} />
                <Stats />
                <ambientLight intensity={1}/>
                <CubeMesh dimensions={[3, 3, 3]}/>
            </Canvas>
        </div>
    )
}