import { Edges } from '@react-three/drei'
import { useMemo } from 'react';

// right, left, top, bottom, front, back
const faceColors = ['orange', 'red', 'white', 'yellow', 'blue', 'green']

function calculateCubeCoords(dimensions) {
    const cubeSize = 1/Math.max(...dimensions)
    const cubeCoords = []

    for (let x = 0; x < dimensions[0]; x++) {
        for (let y = 0; y < dimensions[1]; y++) {
            for (let z = 0; z < dimensions[2]; z++) {
                cubeCoords.push([(x+0.5)*cubeSize, (y+0.5)*cubeSize, (z+0.5)*cubeSize])
            }
        }
    }

    return {cubeSize, cubeCoords}
}

function CubeMesh({dimensions=[3, 3, 3]}) {
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
                />
            ))}
        </mesh>
    )
}

function SingleCube({ position=[0, 0, 0], size=1 }) {
    function isEdge(position, index) {
        switch (index) {
            case 0:
                return position[0] > 1-size
            case 1:
                return position[0] < size
            case 2:
                return position[1] > 1-size
            case 3:
                return position[1] < size
            case 4:
                return position[2] > 1-size
            case 5:
                return position[2] < size
            default:
                return true
        }
    }

    console.log(position, size)

    return (
        <mesh position={position}>
            <boxGeometry args={[size, size, size]} />
            {
                faceColors.map((color, index) => (
                <meshStandardMaterial 
                key={index} 
                attach={`material-${index}`} 
                color={isEdge(position, index) ? faceColors[index] : 'grey'} 
                />
            ))}
            <Edges lineWidth={5} scale={1.01} color='black' />
        </mesh>
    )
}

export default CubeMesh;