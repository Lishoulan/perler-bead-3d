import type { LayerBlueprint } from '../../lib/types';
import { getColorMap } from '../../lib/palette';

interface Props {
  blueprint: LayerBlueprint | null;
}

function BlueprintCanvas({ blueprint }: Props) {
  if (!blueprint || blueprint.count === 0) {
    return <div className="text-slate-400">该层为空</div>;
  }

  const colorMap = getColorMap();
  const { grid, width, height, z } = blueprint;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-slate-100 font-semibold">
        第 {z} 层 (z={z})
      </h3>
      <div
        className="inline-grid"
        style={{
          gridTemplateColumns: `repeat(${width}, 24px)`,
          gridTemplateRows: `repeat(${height}, 24px)`,
        }}
      >
        {grid.map((row, y) =>
          row.map((colorId, x) => {
            const hex =
              colorId !== null ? colorMap[colorId]?.hex : undefined;
            return (
              <div
                key={`${y}-${x}`}
                className="w-6 h-6 border border-slate-600"
                style={{ backgroundColor: hex ?? 'transparent' }}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}

export default BlueprintCanvas;
