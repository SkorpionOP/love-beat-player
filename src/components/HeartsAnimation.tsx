import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Heart({ position, speed }: { position: [number, number, number]; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += speed;
      if (meshRef.current.position.y > 5) {
        meshRef.current.position.y = -5;
      }
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
  heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
  heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
  heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

  const extrudeSettings = {
    depth: 0.3,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1,
  };

  return (
    <mesh ref={meshRef} position={position}>
      <extrudeGeometry args={[heartShape, extrudeSettings]} />
      <meshStandardMaterial 
        color="#FF69B4" 
        emissive="#FF1493"
        emissiveIntensity={0.5}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}

export function HeartsAnimation({ isPlaying }: { isPlaying: boolean }) {
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 5,
    ] as [number, number, number],
    speed: isPlaying ? 0.01 + Math.random() * 0.02 : 0,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF69B4" />
        {hearts.map((heart, i) => (
          <Heart key={i} position={heart.position} speed={heart.speed} />
        ))}
      </Canvas>
    </div>
  );
}
