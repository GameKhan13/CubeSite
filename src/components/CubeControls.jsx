import { useEffect, useMemo, useState } from "react";
import {Sphere, Vector3 } from "three";
import AxisRotation from "../util/AxisRotation";

export default function CubeControls({ slicer, meshRef }) {
    const slices = [slicer.xSlices, slicer.ySlices, slicer.zSlices]

    return (
        <group>
            {
                slices.map((slice, axis) => 
                    slice.map((position, index) => 
                        <CubeControl 
                        key={slicer.maxDimension*axis+index}
                        slicer={slicer}
                        position={position}
                        meshRef={meshRef}
                        axis={axis}
                        />
                    )
                )
                
            }
        </group>
    );
}

function CubeControl({ slicer, axis, position, meshRef }) {
    const axisRotation = useMemo(
        () => new AxisRotation(slicer, axis, position),
        [slicer, axis, position]
    )
    console.log(axisRotation)

    const [shiftHeld, setShiftHeld] = useState(false)
    const [ctrlHeld, setCtrlHeld] = useState(false)

    useEffect(
        () => {
            const keyDown = (e) => {
                switch (e.key) {
                    case 'Shift':
                        setShiftHeld(true)
                        break
                    case 'Control':
                        setCtrlHeld(true)
                        break
                }
            }

            const keyUp = (e) => {
                switch (e.key) {
                    case 'Shift':
                        setShiftHeld(false)
                        break
                    case 'Control':
                        setCtrlHeld(false)
                        break
                }
            }

            window.addEventListener('keydown', keyDown)
            window.addEventListener('keyup', keyUp)

            return () => {
                window.removeEventListener('keydown', keyDown)
                window.removeEventListener('keyup', keyUp)
            }
        },
        []
    )

    const clickPoints = useMemo(
        () => {
            return [
                new Vector3().copy(axisRotation.minCorner),
                new Vector3().copy(axisRotation.minCorner).sub(axisRotation.center).cross(axisRotation.axisNormal).add(axisRotation.center),
                new Vector3().copy(axisRotation.maxCorner),
                new Vector3().copy(axisRotation.maxCorner).sub(axisRotation.center).cross(axisRotation.axisNormal).add(axisRotation.center),
                new Vector3().copy(axisRotation.center).add(new Vector3().copy(axisRotation.axisNormal).multiplyScalar(slicer.sliceSize/2)),
                new Vector3().copy(axisRotation.center).sub(new Vector3().copy(axisRotation.axisNormal).multiplyScalar(slicer.sliceSize/2))
            ]
        },
        [axisRotation, slicer]
    )

    function rotate() {
        const cubes = meshRef.current.children
        
        const intersecting = []
        cubes.forEach((cube) => {
            const boundingSphere = new Sphere(cube.position, slicer.sliceSize*0.1)
            if (axisRotation.collision.intersectsSphere(boundingSphere)) {
                intersecting.push(cube)
            }
        });

        if (intersecting.length === axisRotation.axisDimension) {
            intersecting.forEach((cube) => {
                axisRotation.rotate(
                    cube.position, 
                    cube.quaternion,
                    shiftHeld,
                    ctrlHeld
                )
            });
        }
    }

    const [highlighted, setHighlighted] = useState(false)

    return (
        <>
            <mesh position={axisRotation.center}>
                <boxGeometry 
                args={
                    new Vector3()
                    .copy(axisRotation.axisNormal)
                    .multiplyScalar(slicer.sliceSize-2)
                    .addScalar(2.1).toArray()
                    } 
                />
                <meshStandardMaterial transparent opacity={(highlighted ? 0.85 : 0)} depthWrite={false} />
            </mesh>
            <mesh
            onClick={(e) => e.stopPropagation()}
            onPointerEnter={(e) => e.stopPropagation()}
            onPointerLeave={(e) => e.stopPropagation()}
            >
                <boxGeometry args={[2, 2, 2]}/>
                <meshStandardMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            {
                clickPoints.map((position, index) => <Clickable 
                key={index}
                position={position}
                size={slicer.sliceSize/2}
                onClick={(e) => {
                    e.stopPropagation()
                    rotate()
                }}
                onPointerEnter={(e) => {
                    e.stopPropagation()
                    setHighlighted(true)
                }}
                onPointerLeave={(e) => {
                    e.stopPropagation()
                    setHighlighted(false)
                }}
                />)
            }
        </>
    )
}

function Clickable({ position, size, onClick, onPointerEnter, onPointerLeave }) {

    return <mesh 
    position={position}
    onClick={onClick}
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
    >
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial />
    </mesh>
}