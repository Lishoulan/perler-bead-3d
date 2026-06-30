import type { LayerBlueprint } from '../../lib/types';
import { getColorMap } from '../../lib/palette';

interface Props {
  blueprints: LayerBlueprint[];
}

function ColorStats({ blueprints }: Props) {
  const colorMap = getColorMap();

  // 统计所有层所有拼豆的颜色分布
  const counts = new Map<string, number>();
  for (const bp of blueprints) {
    for (const row of bp.grid) {
      for (const colorId of row) {
        if (colorId === null) continue;
        counts.set(colorId, (counts.get(colorId) ?? 0) + 1);
      }
    }
  }

  const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, entry) => sum + entry[1], 0);

  return (
    <div className="bg-slate-800 p-4 rounded-lg flex flex-col gap-3 min-w-[180px]">
      <h2 className="text-slate-100 font-semibold">颜色统计</h2>
      <div className="text-slate-300 text-sm">总拼豆数:{total}</div>
      <ul className="flex flex-col gap-1">
        {entries.map(([id, n]) => {
          const color = colorMap[id];
          return (
            <li key={id} className="flex items-center gap-2 text-sm">
              <span
                className="w-4 h-4 rounded border border-slate-600 inline-block"
                style={{ backgroundColor: color?.hex ?? '#000000' }}
              />
              <span className="text-slate-200 flex-1">
                {color?.name ?? id}
              </span>
              <span className="text-slate-400">×{n}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ColorStats;
