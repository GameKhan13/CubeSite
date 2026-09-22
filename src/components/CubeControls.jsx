import { useMemo, useState } from "react";
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
            quaternion.setFromAxisAngle(
                axisVector,
                PI.value*-0.5
            )
            return quaternion
        },
        [axis]
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
    
    return (
        <>
            <Clickable box3={boundingBox} onClick={rotate}/>
        </>
    )
}

function Clickable({ box3, onClick }) {
    const [hovered, setHovered] = useState(false)

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

    return <mesh 
        position={center} 
        onClick={(e) => {
            e.stopPropagation()
            onClick()
        }}
        onPointerEnter={(e) => {
            e.stopPropagation()
            setHovered(true)
        }}
        onPointerLeave={(e) => {
            e.stopPropagation()
            setHovered(false)
        }}
        >
        <boxGeometry args={size} />
        <meshStandardMaterial transparent opacity={hovered ? 0.85 : 0} depthWrite={false} />
    </mesh>
}