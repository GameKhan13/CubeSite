import { Edges } from '@react-three/drei'

// right, left, top, bottom, front, back
const faceColors = ['orange', 'red', 'white', 'yellow', 'blue', 'green']

function CubeMesh() {
    // build array
    const cubeCoords = [];
    const possiblePositions = [-1, 0, 1]
    for (const x of possiblePositions) {
        for (const y of possiblePositions) {
            for (const z of possiblePositions) {
                cubeCoords.push([x, y, z])
            }
        }
    }

    return (
        <>
            {
                cubeCoords.map((coord) => (
                <SingleCube 
                    position={coord}
                    sides={[
                        coord[0] === 1,
                        coord[0] === -1,
                        coord[1] === 1,
                        coord[1] === -1,
                        coord[2] === 1,
                        coord[2] === -1
                    ]}
                />
            ))}
        </>
    )
}

function SingleCube({ position, sides }) {
    function brightnessUp() {
        
    }

    return (
        <mesh position={position} onPointerOver={brightnessUp}>
            <boxGeometry args={[1, 1, 1]} />
            {
                faceColors.map((color, index) => (
                <meshStandardMaterial 
                key={index} 
                attach={`material-${index}`} 
                color={sides[index] ? color : 'grey'} 
                />
            ))}
            <Edges lineWidth={5} scale={1.01} color='black' />
        </mesh>
    )
}

export default CubeMesh;