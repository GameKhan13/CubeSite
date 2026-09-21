import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

// 1. Keep your 3D logic in a dedicated sub-component
function SceneContent() {
  const parentA = useRef()
  const parentB = useRef()
  const child = useRef()
  const [currentParent, setCurrentParent] = useState('A')

  useEffect(() => {
    if (!child.current) return
    const targetParent = currentParent === 'A' ? parentA.current : parentB.current
    if (targetParent) {
      targetParent.attach(child.current)
    }
  }, [currentParent])

  // 💡 useFrame works perfectly here because SceneContent sits INSIDE <Canvas>
  useFrame(() => {
    if (parentA.current) parentA.current.rotation.y += 0.01
    if (parentB.current) parentB.current.rotation.z += 0.01
  })

  return (
    <group>
      <mesh ref={parentA} position={[-2, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>

      <mesh ref={parentB} position={[2, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="blue" />
      </mesh>

      <mesh ref={child} position={[0, 1.5, 0]} scale={0.5}>
        <boxGeometry />
        <meshStandardMaterial color="yellow" />
      </mesh>

      {/* HTML buttons won't work inside Canvas, so we use a 3D click target */}
      <mesh position={[0, -2, 0]} onClick={() => setCurrentParent(p => p === 'A' ? 'B' : 'A')}>
        <boxGeometry args={[2, 0.5, 0.2]} />
        <meshBasicMaterial color="gray" />
      </mesh>
    </group>
  )
}

// 2. The main export that mounts the Canvas wrapper
export default function Testing() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        
        {/* 💡 SceneContent goes HERE */}
        <SceneContent />
        
      </Canvas>
    </div>
  )
}
