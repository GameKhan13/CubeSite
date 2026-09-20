import { Edges } from '@react-three/drei'

// right, left, top, bottom, front, back
const faceColors = ['orange', 'red', 'white', 'yellow', 'blue', 'green']

function CubeMesh() {
    const defaultState = faceColors.map(color => Array(9).fill(color));

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
            <SingleCube id='cube-root'>
                <group>
                    <SingleCube id='cube-right' position={[1, 0, 0]} />
                    <SingleCube id='cube-left' position={[-1, 0, 0]} />
                    <SingleCube id='cube-top' position={[0, 1, 0]} />
                    <SingleCube id='cube-bottom' position={[0, -1, 0]} />
                    <SingleCube id='cube-front' position={[0, 0, 1]} />
                    <SingleCube id='cube-back' position={[0, 0, -1]} />
                </group>
            </SingleCube>
        </>
    )
}

function SingleCube({ position=[0, 0, 0], sides=[false, false, false, false, false, false], children }) {


    return (
        <mesh position={position}>
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
            {children}
        </mesh>
    )
}

export default CubeMesh;