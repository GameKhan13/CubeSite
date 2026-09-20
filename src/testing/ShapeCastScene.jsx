import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'

// 1. Keep your 3D logic and hooks inside this sub-component
function ShapeCastScene() {
  const collectionGroup = useRef()

  const [searchBox] = useState(() => new THREE.Box3(
    new THREE.Vector3(-2, -2, -2),
    new THREE.Vector3(2, 2, 2)
  ))

  const castBoxShape = () => {
    if (!collectionGroup.current) return
    
    collectionGroup.current.children.forEach((child) => {
      const childBox = new THREE.Box3().setFromObject(child)
      if (searchBox.intersectsBox(childBox)) {
        child.material.color.set('red')
      } else {
        child.material.color.set('white')
      }
    })
  }

  // 💡 This hook will now succeed because ShapeCastScene is inside <Canvas>
  useFrame(() => {
    castBoxShape()
  })

  return (
    <group>
      <box3Helper args={[searchBox, 0xffff00]} />

      <group ref={collectionGroup}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[1.8, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[-3, 2, 2]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
    </group>
  )
}

// 2. This is the main component you export or display. 
// It initializes the canvas wrapper.
export default function Testing2 () {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, -5, 0]}}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, -2, 0]} />
        
        {/* 💡 RENDER IT HERE: Inside the Canvas tags */}
        <ShapeCastScene />
        
      </Canvas>
    </div>
  )
}
