import { Edges } from '@react-three/drei'
import { forwardRef, useMemo } from 'react';
import { Sphere } from 'three';
import { generateUUID } from 'three/src/math/MathUtils.js';

// right, left, top, bottom, front, back
const faceColors = ['orange', 'red', 'white', 'yellow', 'blue', 'green']

const CubeMesh = forwardRef(({ slicer }, ref) => {
    const cubeCoords = useMemo(
        () => {
            const cubeCoords = []

            for (let x = 0; x < slicer.x; x++) {
                for (let y = 0; y < slicer.y; y++) {
                    for (let z = 0; z < slicer.z; z++) {
                        cubeCoords.push(
                            [x, y, z]
                        )
                    }
                }
            }

            return cubeCoords
        },
        [slicer]
    )

    return (
        <mesh ref={ref}>
            {
                cubeCoords.map((position, index) => (
                <SingleCube 
                key={index}
                position={position}
                slicer={slicer}
                />
                ))
            }
        </mesh>
    )
})

function SingleCube({ position, slicer }) {
    function isEdge(index) {
        const axis = Math.floor(index/2) // 0-2
        const side = index%2 // 0-1
        return position[axis] === (side ? 0 : slicer.dimensions[axis]-1)
    }

    return (
        <mesh key={slicer.dimensions.join('')} position={[slicer.xSlices[position[0]], slicer.ySlices[position[1]], slicer.zSlices[position[2]]]}>
            <boxGeometry args={new Array(3).fill(slicer.sliceSize)} />
            {
                faceColors.map((color, index) => (
                <meshStandardMaterial 
                key={index} 
                attach={`material-${index}`} 
                color={isEdge(index) ? color : 'grey'} 
                />
            ))}
            <Edges lineWidth={5} scale={1.01} color='black' />
        </mesh>
    )
}

export default CubeMesh