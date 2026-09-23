import { useEffect, useMemo, useState } from "react";
import { Sphere, Vector3 } from "three";
import AxisRotation from "../util/AxisRotation";

export default function CubeControls({ slicer, meshRef }) {
    const slices = [slicer.xSlices, slicer.ySlices, slicer.zSlices]

    return (
        <group>
            <mesh
            onClick={(e) => e.stopPropagation()}
            onPointerEnter={(e) => e.stopPropagation()}
            onPointerLeave={(e) => e.stopPropagation()}
            >
                <boxGeometry args={
                    slicer.dimensions
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
    const [axisRotation, setAxisRotation] = useState(new AxisRotation(slicer, axis, position))
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

    function rotate() {
        const cubes = meshRef.current.children
        
        const intersecting = []
        cubes.forEach((cube) => {
            const boundingSphere = new Sphere(cube.position, slicer.sliceSize*0.1)
            if (axisRotation.collision.intersectsSphere(boundingSphere)) {
                intersecting.push({position: cube.position, quaternion: cube.quaternion})
            }
        });

        if (intersecting.length === axisRotation.axisDimension) {
            const newAxisRotation = Object.assign(
                Object.create(Object.getPrototypeOf(axisRotation)), 
                axisRotation
            )
            newAxisRotation.dimensionScale = axisRotation.rotate(
                intersecting,
                shiftHeld,
                ctrlHeld
            )
            setAxisRotation(newAxisRotation)
        }
    }

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
                <meshStandardMaterial transparent opacity={(highlighted ? 0.85 : 0)} depthWrite={false} />
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