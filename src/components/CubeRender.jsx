import { Canvas } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import './CubeRender.css'
import CubeMesh from './CubeMesh'
import CubeControls from './CubeControls'
import Slicer from '../util/Slicer'
import { MOUSE } from 'three'
import { useMemo, useRef } from 'react'

export default function CubeRender({dimensions=[3, 3, 3]}) {
    const slicer = useMemo(
        () => new Slicer(dimensions),
        [dimensions]
    )
    const mesh = useRef(null)

    return (
        <div id='canvas-container' key={dimensions.join('')}>
            <Canvas camera={{position: [2, 2, 2]}}>
                <OrbitControls enablePan={false} enableZoom={false} mouseButtons={{RIGHT: MOUSE.ROTATE}} />
                <Stats />
                <ambientLight intensity={1}/>
                <CubeMesh slicer={slicer} ref={mesh}/>
                <CubeControls slicer={slicer} meshRef={mesh}/>
            </Canvas>
        </div>
    )
}