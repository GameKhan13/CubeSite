import { useMemo, useState } from "react";
import { Box3, Vector3 } from "three";


export default function CubeControls({ dimensions }) {

    const controlData = []
    const biggestDim = dimensions.maxDimension
    const cubeSize = 1/biggestDim

    for (let x = 0; x < dimensions.x; x++) {
        controlData.push([
            (x+(1+biggestDim-dimensions.x)*0.5)*cubeSize-0.5,
            0
        ])
    }

    for (let y = 0; y < dimensions.y; y++) {
        controlData.push([
            (y+(1+biggestDim-dimensions.y)*0.5)*cubeSize-0.5,
            1
        ])
    }

    for (let z = 0; z < dimensions.z; z++) {
        controlData.push([
            (z+(1+biggestDim-dimensions.z)*0.5)*cubeSize-0.5,
            2
        ])
    }

    return (
        <group>
            {
                controlData.map(([position, axis], index) => 
                <CubeControl 
                key={index}
                position={position}
                axis={axis}
                />
                )
            }
        </group>
    );
}

function CubeControl({ position, axis }) {
    function getBoundingBox() {
        switch (axis) {
            case 0:
                return new Box3(
                    new Vector3(position, -1, -1),
                    new Vector3(position, 1, 1)
                )
            case 1:
                return new Box3(
                    new Vector3(-1, position, -1),
                    new Vector3(1, position, 1)
                )
            case 2:
                return new Box3(
                    new Vector3(-1, -1, position),
                    new Vector3(1, 1, position)
                )
            default:
                return new Box3(
                    new Vector3(0, 0, 0),
                    new Vector3(0, 0, 0)
                )
        }
    }
    
    const boundingBox = getBoundingBox()

    return (
        <>
            <box3Helper args={[boundingBox, 'red']}/>
            <Clickable />
        </>
    )
}

function Clickable() {


    return <mesh position={[2, 2, 2]} onClick={() => console.log('Clicked')}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial transparent opacity={0.5} />
    </mesh>
}