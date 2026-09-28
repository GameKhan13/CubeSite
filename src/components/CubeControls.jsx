import { useCallback, useEffect, useMemo, useState } from "react";
import { Box3, Quaternion, Vector3 } from "three";
import AxisRotation from "../util/AxisRotation";
import RotationNotation from "../util/RotationNotation";
import { useFrame } from "@react-three/fiber";

export default function CubeControls({ active, slicer, meshRef, rotationData, setRotationData }) {
    const slices = [slicer.xSlices, slicer.ySlices, slicer.zSlices]

    const [shiftHeld, setShiftHeld] = useState(false)
    const [ctrlHeld, setCtrlHeld] = useState(false)

    const [quaternion, setQuaternion] = useState()
    const steps = 20
    const [rotationStep, setRotationStep] = useState(0)
    const [rotationTargets, setRotationTargets] = useState()
    const [snaps, setSnaps] = useState()

    useFrame(() => {
        if (rotationStep > 0) {
            rotationTargets.forEach(({cubePosition, cubeQuaternion}) => {
                cubePosition.applyQuaternion(quaternion)
                cubeQuaternion.premultiply(quaternion)
            });
            if (rotationStep === steps) {
                // snap
                rotationTargets.forEach(({cubePosition, cubeQuaternion}, index) => {
                    cubePosition.copy(snaps[index].cubePosition)
                    cubeQuaternion.copy(snaps[index].cubeQuaternion)
                });
                setRotationStep(0)
            } else {
                setRotationStep(rotationStep+1)
            }
        }
    })

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
            if (rotationStep > 0) {
                return
            }

            const cubes = meshRef.current.children
            
            const intersecting = []
            cubes.forEach((cube) => {
                const boundingBox = new Box3().setFromObject(cube)
                if (axisRotation.collision.intersectsBox(boundingBox)) {
                    intersecting.push({cubePosition: cube.position, cubeQuaternion: cube.quaternion})
                }
            });            

            if (intersecting.length === axisRotation.axisDimension) {
                const {quaternion, moveName} = axisRotation.getQuaternion(
                    shiftHeld,
                    ctrlHeld
                )

                const finals = []

                intersecting.forEach(({cubePosition, cubeQuaternion}) => {
                    finals.push({
                        cubePosition: new Vector3().copy(cubePosition).applyQuaternion(quaternion),
                        cubeQuaternion: new Quaternion().copy(cubeQuaternion).premultiply(quaternion)
                    })
                });

                setRotationTargets(intersecting)
                setSnaps(finals)
                setQuaternion(new Quaternion().identity().slerp(quaternion, 1/steps))
                setRotationStep(1)
                setRotationData([
                    ...rotationData,
                    new RotationNotation(moveName)
                ])
            }
        },
        [ctrlHeld, meshRef, rotationData, rotationStep, setRotationData, shiftHeld]
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
                        active={active && rotationStep === 0}
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
                    if(active) {
                        rotateFunc(axisRotation)
                    }
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