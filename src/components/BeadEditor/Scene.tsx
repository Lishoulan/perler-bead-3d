import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import GridPlane from './GridPlane';

const GRID_SIZE = 32;

function Scene() {
  return (
    <Canvas camera={{ position: [20, 25, 20], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
      <GridPlane />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[GRID_SIZE / 2, -0.01, GRID_SIZE / 2]}
      >
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <OrbitControls
        mouseButtons={{
          LEFT: undefined,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
      />
    </Canvas>
  );
}

export default Scene;
