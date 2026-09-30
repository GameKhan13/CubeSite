import { Edges } from '@react-three/drei'
import { forwardRef, useCallback, useMemo } from 'react';

// right, left, top, bottom, front, back
const faceColors = ['blue', 'green', 'white', 'yellow', 'red', 'orange']

const CubeMesh = forwardRef(({ slicer }, ref) => {
    const cubeCoords = useMemo(
        () => {
            const cubeCoords = []

            for (let x = 0; x < slicer.dimensions.x; x++) {
                for (let y = 0; y < slicer.dimensions.y; y++) {
                    for (let z = 0; z < slicer.dimensions.z; z++) {
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
    const isEdge = useCallback(
        (index) => {
            const axis = Math.floor(index/2) // 0-2
            const side = index%2 // 0-1
            return position[axis] === (side ? 0 : slicer.dimensions.getComponent(axis)-1)
        },
        [position, slicer]
    )

    return (
        <mesh 
        position={[slicer.xSlices[position[0]], slicer.ySlices[position[1]], slicer.zSlices[position[2]]]}
        key={slicer.dimensions.toArray().join("")}
        >
            <boxGeometry args={new Array(3).fill(slicer.sliceSize)} />
            {
                faceColors.map((color, index) => (
                <meshStandardMaterial 
                key={index} 
                attach={`material-${index}`} 
                color={isEdge(index) ? color : 'grey'} 
                />
            ))}
            <Edges lineWidth={10*slicer.sliceSize} scale={1.01} color='black' />
        </mesh>
    )
}

export default CubeMesh