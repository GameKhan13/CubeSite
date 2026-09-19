import { Canvas } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import './CubeRender.css'
import CubeMesh from './CubeMesh'

export function CubeRender() {
    
    
    return (
        <div id='canvas-container'>
            <Canvas camera={{position: [3, 3, 3]}}>
                <OrbitControls enablePan={false} />
                <Stats />
                <ambientLight intensity={1}/>
                <CubeMesh position={[0, 0, 0]} />
            </Canvas>
        </div>
    )
}