import type { ThreeEvent } from '@react-three/fiber';
import { getColorMap } from '../../lib/palette';
import { useStore } from '../../lib/store';
import type { Bead } from '../../lib/types';

interface BeadMeshProps {
  bead: Bead;
}

function BeadMesh({ bead }: BeadMeshProps) {
  const tool = useStore((s) => s.tool);
  const removeBeadAt = useStore((s) => s.removeBeadAt);

  const hex = getColorMap()[bead.colorId]?.hex ?? '#cccccc';

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (tool === 'erase') {
      removeBeadAt(bead.x, bead.y, bead.z);
    }
  };

  return (
    <mesh
      position={[bead.x + 0.5, bead.z * 0.5 + 0.25, bead.y + 0.5]}
      onClick={handleClick}
    >
      <cylinderGeometry args={[0.4, 0.4, 0.5, 16]} />
      <meshStandardMaterial color={hex} />
    </mesh>
  );
}

export default BeadMesh;
