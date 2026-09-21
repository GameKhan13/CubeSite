import { Edges } from '@react-three/drei'
import { useMemo } from 'react';

// right, left, top, bottom, front, back
const faceColors = ['orange', 'red', 'white', 'yellow', 'blue', 'green']

function calculateCubeCoords(dimensions) {
    const biggestDim = dimensions.maxDimension
    const cubeSize = 1/biggestDim
    const cubeCoords = []

    for (let x = 0; x < dimensions.x; x++) {
        for (let y = 0; y < dimensions.y; y++) {
            for (let z = 0; z < dimensions.z; z++) {
                cubeCoords.push([
                    (x+(1+biggestDim-dimensions.x)*0.5)*cubeSize, 
                    (y+(1+biggestDim-dimensions.y)*0.5)*cubeSize, 
                    (z+(1+biggestDim-dimensions.z)*0.5)*cubeSize
                ])
            }
        }
    }

    return {cubeSize, cubeCoords}
}

function CubeMesh({ dimensions }) {
    const { cubeSize, cubeCoords } = useMemo(
        () => calculateCubeCoords(dimensions),
        [dimensions]
    )

    return (
        <mesh position={[-0.5, -0.5, -0.5]}>
            {
                cubeCoords.map((coord, index) => (
                <SingleCube 
                key={index}
                position={coord} 
                size={cubeSize}
                dimensions={dimensions}
                />
            ))}
        </mesh>
    )
}

function SingleCube({ position, size, dimensions }) {
    const bounds = useMemo(
        () => dimensions.dimensions.map((dim) => (dimensions.maxDimension-dim+1)*size),
        [dimensions, size]
    );

    function isEdge(index) {
        const axis = Math.floor(index / 2) // 0-2
        const side = index % 2 // 0-1

        return (side ? position[axis] : 1-position[axis]) < bounds[axis]
    }

    return (
        <mesh position={position}>
            <boxGeometry args={[size, size, size]} />
            {
                faceColors.map((color, index) => (
                <meshStandardMaterial 
                key={index} 
                attach={`material-${index}`} 
                color={isEdge(index) ? color : 'grey'} 
                />
            ))}
            <Edges key={size} lineWidth={5} scale={1.01} color='black' />
        </mesh>
    )
}

export default CubeMesh;