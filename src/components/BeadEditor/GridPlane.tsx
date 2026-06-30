import type { ThreeEvent } from '@react-three/fiber';
import { useStore } from '../../lib/store';
import BeadMesh from './BeadMesh';

const GRID_SIZE = 32;

function GridPlane() {
  const currentLayer = useStore((s) => s.currentLayer);
  const tool = useStore((s) => s.tool);
  const placeBead = useStore((s) => s.placeBead);
  const eraseBead = useStore((s) => s.eraseBead);
  const beads = useStore((s) => s.model.beads);

  const handlePlaneClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const dataX = Math.floor(e.point.x);
    const dataY = Math.floor(e.point.z);
    if (dataX < 0 || dataX >= GRID_SIZE || dataY < 0 || dataY >= GRID_SIZE) {
      return;
    }
    if (tool === 'draw') {
      placeBead(dataX, dataY);
    } else if (tool === 'erase') {
      eraseBead(dataX, dataY);
    }
  };

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[GRID_SIZE / 2, currentLayer * 0.5, GRID_SIZE / 2]}
        onClick={handlePlaneClick}
      >
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshStandardMaterial transparent opacity={0.2} color="#444" />
      </mesh>
      <gridHelper
        args={[GRID_SIZE, GRID_SIZE, '#888', '#444']}
        position={[GRID_SIZE / 2, currentLayer * 0.5, GRID_SIZE / 2]}
      />
      {beads.map((b) => (
        <BeadMesh key={`${b.x}-${b.y}-${b.z}`} bead={b} />
      ))}
    </>
  );
}

export default GridPlane;
