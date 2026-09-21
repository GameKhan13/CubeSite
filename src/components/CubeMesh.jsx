import { Edges } from '@react-three/drei'
import { useMemo } from 'react';
import { Vector3 } from 'three';

// right, left, top, bottom, front, back
const faceColors = ['orange', 'red', 'white', 'yellow', 'blue', 'green']

export default function CubeMesh({ slicer }) {
    function calculateCubeCoords() {
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
    }
    const cubeCoords = useMemo(
        calculateCubeCoords,
        [slicer]
    )

    return (
        <mesh>
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
}

function SingleCube({ position, slicer }) {
    function isEdge(index) {
        const axis = Math.floor(index/2) // 0-2
        const side = index%2 // 0-1
        return position[axis] === (side ? 0 : slicer.dimensions[axis]-1)
    }

    return (
        <mesh position={[slicer.xSlices[position[0]], slicer.ySlices[position[1]], slicer.zSlices[position[2]]]}>
            <boxGeometry args={new Array(3).fill(slicer.sliceSize)} />
            {
                faceColors.map((color, index) => (
                <meshStandardMaterial 
                key={index} 
                attach={`material-${index}`} 
                color={isEdge(index) ? color : 'grey'} 
                />
            ))}
            <Edges key={slicer.sliceSize} lineWidth={5} scale={1.01} color='black' />
        </mesh>
    )
}