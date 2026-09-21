import { useMemo, useState } from "react";
import { Box3, Vector3 } from "three";


export default function CubeControls({ slicer, meshRef }) {

    const controlData = []
    const biggestDim = slicer.maxDimension
    const cubeSize = slicer.sliceSize

    return (
        <group>
            <CubeControl slicer={slicer} position={0} axis={0}/>

            {
                // controlData.map(([position, axis], index) => 
                // <CubeControl 
                // key={index}
                // position={position}
                // axis={axis}
                // />
                // )
            }
        </group>
    );
}

function CubeControl({ slicer, position, axis }) {
    function rotate() {
        console.log('rotate')
    }

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
    
    const boundingBox = useMemo(
        getBoundingBox,
        [position, axis]
    )
    
    return (
        <>
            <Clickable box3={boundingBox} onClick={rotate}/>
        </>
    )
}

function Clickable({ box3, onClick }) {
    const size = useMemo(() => {
        const vec = new Vector3();
        box3.getSize(vec)
        return [vec.x, vec.y, vec.z];
    }, [box3]);

    const center = useMemo(() => {
        const vec = new Vector3();
        box3.getCenter(vec);
        return [vec.x, vec.y, vec.z];
    }, [box3]);

    return <mesh position={center} onClick={onClick} >
        <boxGeometry args={size} />
        <meshStandardMaterial transparent opacity={0.5} />
    </mesh>
}