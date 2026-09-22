import { useEffect, useMemo, useState } from "react";
import { Box3, Quaternion, Sphere, Vector3 } from "three";
import { PI } from "three/tsl";

export default function CubeControls({ slicer, meshRef }) {
    function createAxis(axis) {
        let slices
        switch (axis) {
            case 0:
                slices = slicer.xSlices
                break
            case 1:
                slices = slicer.ySlices
                break
            case 2:
                slices = slicer.zSlices
                break
            default:
                slices = slicer.xSlices
                break
        }
        return <group>
            {
                slices.map((slice, index) => 
                <CubeControl 
                key={index}
                slicer={slicer}
                position={slice}
                meshRef={meshRef}
                axis={axis}
                />
                )
            }
        </group>
    }

    return (
        <group>
            {createAxis(0)}
            {createAxis(1)}
            {createAxis(2)}
        </group>
    );
}

function CubeControl({ slicer, axis, position, meshRef }) {

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

    const rotationQuarternion = useMemo(
        () => {
            const quaternion = new Quaternion()
            const axisVector = new Vector3(0, 0, 0)
            switch (axis) {
                case 0:
                    axisVector.x = 1
                    break
                case 1:
                    axisVector.y = 1
                    break
                case 2:
                    axisVector.z = 1
                    break
                default:
                    axisVector.x = 1
                    break
            }

            const reverse = (-1)**((position>=0)+(shiftHeld))
            const double = (2)**((ctrlHeld))
            quaternion.setFromAxisAngle(
                axisVector,
                PI.value*(0.5)*reverse*double
            )
            return quaternion
        },
        [axis, position, ctrlHeld, shiftHeld]
    )
    
    const boundingBox = useMemo(
        () => {
            const rotund = 1.1
            const halfWidth = slicer.sliceSize*0.49

            switch (axis) {
                case 0:
                    return new Box3(
                        new Vector3(position-halfWidth, -rotund, -rotund),
                        new Vector3(position+halfWidth, rotund, rotund)
                    )
                case 1:
                    return new Box3(
                        new Vector3(-rotund, position-halfWidth, -rotund),
                        new Vector3(rotund, position+halfWidth, rotund)
                    )
                case 2:
                    return new Box3(
                        new Vector3(-rotund, -rotund, position-halfWidth),
                        new Vector3(rotund, rotund, position+halfWidth)
                    )
                default:
                    return new Box3(
                        new Vector3(0, 0, 0),
                        new Vector3(0, 0, 0)
                    )
            }
        },
        [slicer, axis, position]
    )

    const properHits = useMemo(
        () => {
            switch (axis) {
                case 0:
                    return slicer.y * slicer.z
                case 1:
                    return slicer.x * slicer.z
                case 2:
                    return slicer.x * slicer.y
                default:
                    return 0
            }
        },
        [axis, slicer]
    )

    const center = useMemo(
        () => {
            const center = new Vector3()
            return boundingBox.getCenter(center)
        },
        [boundingBox]
    )

    const size = useMemo(
        () => {
            const size = new Vector3()
            boundingBox.getSize(size)
            return size
        },
        [boundingBox]
    )

    const clickPoints = useMemo(
        () => {
            const indent = 0.1
            switch (axis) {
                case 0:
                    return [
                        new Vector3(center.x, boundingBox.min.y+indent, boundingBox.min.z+indent),
                        new Vector3(center.x, boundingBox.max.y-indent, boundingBox.min.z+indent),
                        new Vector3(center.x, boundingBox.max.y-indent, boundingBox.max.z-indent),
                        new Vector3(center.x, boundingBox.min.y+indent, boundingBox.max.z-indent),
                        new Vector3(boundingBox.min.x, center.y, center.z),
                        new Vector3(boundingBox.max.x, center.y, center.z)
                    ]
                case 1:
                    return [
                        new Vector3(boundingBox.min.x+indent, center.y, boundingBox.min.z+indent),
                        new Vector3(boundingBox.max.x-indent, center.y, boundingBox.min.z+indent),
                        new Vector3(boundingBox.max.x-indent, center.y, boundingBox.max.z-indent),
                        new Vector3(boundingBox.min.x+indent, center.y, boundingBox.max.z-indent),
                        new Vector3(center.x, boundingBox.min.y, center.z),
                        new Vector3(center.x, boundingBox.max.y, center.z)
                    ]
                case 2:
                    return [
                        new Vector3(boundingBox.min.x+indent, boundingBox.min.y+indent, center.z),
                        new Vector3(boundingBox.max.x-indent, boundingBox.min.y+indent, center.z),
                        new Vector3(boundingBox.max.x-indent, boundingBox.max.y-indent, center.z),
                        new Vector3(boundingBox.min.x+indent, boundingBox.max.y-indent, center.z),
                        new Vector3(center.x, center.y, boundingBox.min.z),
                        new Vector3(center.x, center.y, boundingBox.max.z)
                    ]
            }
        },
        [axis, boundingBox, center]
    )

    function rotate() {
        const cubes = meshRef.current.children
        
        const intersecting = []
        cubes.forEach((cube) => {
            const boundingSphere = new Sphere(cube.position, slicer.sliceSize*0.1)
            if (boundingBox.intersectsSphere(boundingSphere)) {
                intersecting.push(cube)
            }
        });

        if (intersecting.length === properHits) {
            const offSet = new Vector3()
            intersecting.forEach((cube) => {
                offSet.copy(cube.position).sub(center)
                offSet.applyQuaternion(rotationQuarternion)
                cube.position.copy(center).add(offSet)
                cube.quaternion.premultiply(rotationQuarternion)
            });
        }
    }

    const [highlighted, setHighlighted] = useState(false)

    return (
        <>
            <mesh position={center}>
                <boxGeometry args={size.toArray()} />
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