import { useRef, useMemo } from 'react';
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
      meshRef.current.rotation.y += 0.01;
    }
  });

  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
  heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
  heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
  heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

  const extrudeSettings = {
    depth: 0.4,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1,
  };

  return (
    <mesh ref={meshRef} position={position}>
      <extrudeGeometry args={[heartShape, extrudeSettings]} />
      <meshStandardMaterial 
        color="#3B82F6" 
        emissive="#2563EB"
        emissiveIntensity={0.8}
        metalness={0.7}
        roughness={0.2}
      />
    </mesh>
  );
}

function Petal({ position, speed, delay }: { position: [number, number, number]; speed: number; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.position.y += speed * 0.5;
      meshRef.current.position.x += Math.sin(time) * 0.005;
      meshRef.current.rotation.x = time * 0.5;
      meshRef.current.rotation.z = Math.sin(time * 2) * 0.5;
      
      if (meshRef.current.position.y > 5) {
        meshRef.current.position.y = -5;
      }
    }
  });

  const petalShape = new THREE.Shape();
  petalShape.moveTo(0, 0);
  petalShape.quadraticCurveTo(0.3, 0.5, 0, 1);
  petalShape.quadraticCurveTo(-0.3, 0.5, 0, 0);

  return (
    <mesh ref={meshRef} position={position}>
      <extrudeGeometry args={[petalShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02 }]} />
      <meshStandardMaterial 
        color="#06B6D4" 
        emissive="#0EA5E9"
        emissiveIntensity={0.6}
        metalness={0.5}
        roughness={0.3}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    const colors = new Float32Array(300 * 3);
    
    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Blue shades
      const blueVariant = Math.random();
      colors[i * 3] = 0.2 + blueVariant * 0.3;
      colors[i * 3 + 1] = 0.5 + blueVariant * 0.5;
      colors[i * 3 + 2] = 1;
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + positions[i]) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function HeartsAnimation({ isPlaying }: { isPlaying: boolean }) {
  const hearts = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
      ] as [number, number, number],
      speed: isPlaying ? 0.008 + Math.random() * 0.015 : 0,
    })), [isPlaying]
  );

  const petals = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      speed: isPlaying ? 0.01 + Math.random() * 0.02 : 0,
      delay: Math.random() * 10,
    })), [isPlaying]
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#3B82F6" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#06B6D4" />
        <pointLight position={[0, 0, 5]} intensity={0.8} color="#2563EB" />
        
        <Particles />
        
        {hearts.map((heart, i) => (
          <Heart key={`heart-${i}`} position={heart.position} speed={heart.speed} />
        ))}
        
        {petals.map((petal, i) => (
          <Petal 
            key={`petal-${i}`} 
            position={petal.position} 
            speed={petal.speed}
            delay={petal.delay}
          />
        ))}
      </Canvas>
    </div>
  );
}
