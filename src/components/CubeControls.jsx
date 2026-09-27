import { useCallback, useEffect, useMemo, useState } from "react";
import { Sphere, Vector3 } from "three";
import AxisRotation from "../util/AxisRotation";
import RotationNotation from "../util/RotationNotation";

export default function CubeControls({ active, slicer, meshRef, rotationData, setRotationData }) {
    const slices = [slicer.xSlices, slicer.ySlices, slicer.zSlices]

    const [shiftHeld, setShiftHeld] = useState(false)
    const [ctrlHeld, setCtrlHeld] = useState(false)

    const [rotating, setRotating] = useState(false)

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

    const rotate = useCallback(
        (axisRotation) => {
            if (!active || rotating) {
                return
            }

            const cubes = meshRef.current.children
            
            const intersecting = []
            cubes.forEach((cube) => {
                const boundingSphere = new Sphere(cube.position, slicer.sliceSize*0.1)
                if (axisRotation.collision.intersectsSphere(boundingSphere)) {
                    intersecting.push({position: cube.position, quaternion: cube.quaternion})
                }
            });

            if (intersecting.length === axisRotation.axisDimension) {
                setRotationData([
                    ...rotationData,
                    new RotationNotation(axisRotation.rotate(
                        intersecting,
                        shiftHeld,
                        ctrlHeld
                    ))
                ])
            }
        },
        [active, rotating, setRotating, rotationData, slicer, setRotationData, meshRef, ctrlHeld, shiftHeld]
    )

    return (
        <group>
            <mesh
            onClick={(e) => e.stopPropagation()}
            onPointerEnter={(e) => e.stopPropagation()}
            onPointerLeave={(e) => e.stopPropagation()}
            >
                <boxGeometry args={
                    new Vector3().copy(slicer.dimensions)
                    .multiplyScalar(slicer.sliceSize)
                    .toArray()
                }
                />
                <meshStandardMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            {
                slices.map((slice, axis) => 
                    slice.map((position, index) => 
                        <CubeControl 
                        key={slicer.maxDimension*axis+index}
                        active={active && !rotating}
                        slicer={slicer}
                        axis={axis}
                        position={position}
                        rotateFunc={rotate}
                        />
                    )
                )
                
            }
        </group>
    );
}

function CubeControl({ active, slicer, axis, position, rotateFunc }) {
    const axisRotation = useMemo(
        () => new AxisRotation(slicer, axis, position),
        [slicer, axis, position]
    )

    const clickPoints = useMemo(
        () => {
            return [
                new Vector3().copy(axisRotation.basis1).add(axisRotation.basis2).multiply(axisRotation.dimensionScale).multiplyScalar(1/2).add(axisRotation.center),
                new Vector3().copy(axisRotation.basis1).sub(axisRotation.basis2).multiply(axisRotation.dimensionScale).multiplyScalar(1/2).add(axisRotation.center),
                new Vector3().copy(axisRotation.basis1).multiplyScalar(-1).add(axisRotation.basis2).multiply(axisRotation.dimensionScale).multiplyScalar(1/2).add(axisRotation.center),
                new Vector3().copy(axisRotation.basis1).multiplyScalar(-1).sub(axisRotation.basis2).multiply(axisRotation.dimensionScale).multiplyScalar(1/2).add(axisRotation.center),
                new Vector3().copy(axisRotation.center).add(new Vector3().copy(axisRotation.axisNormal).multiplyScalar(slicer.sliceSize/2)),
                new Vector3().copy(axisRotation.center).sub(new Vector3().copy(axisRotation.axisNormal).multiplyScalar(slicer.sliceSize/2))
            ]
        },
        [axisRotation, slicer]
    )

    const [highlighted, setHighlighted] = useState(false)

    return (
        <>
            <mesh position={axisRotation.center}>
                <boxGeometry 
                args={
                    new Vector3().copy(axisRotation.dimensionScale)
                    .add(
                        new Vector3().copy(axisRotation.axisNormal)
                        .multiplyScalar(slicer.sliceSize)
                    )
                    .addScalar(0.1)
                    .toArray()
                    } 
                />
                <meshStandardMaterial transparent opacity={(highlighted&&active ? 0.85 : 0)} depthWrite={false} />
            </mesh>
            {
                clickPoints.map((position, index) => <Clickable 
                key={index}
                active={active}
                position={position}
                size={slicer.sliceSize/2}
                onClick={(e) => {
                    e.stopPropagation()
                    rotateFunc(axisRotation)
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

function Clickable({ active, position, size, onClick, onPointerEnter, onPointerLeave }) {

    return <mesh 
    position={position}
    onClick={onClick}
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
    >
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial transparent opacity={active?0.5:0} color={'grey'} depthWrite={false} />
    </mesh>
}