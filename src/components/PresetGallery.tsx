import { useMemo } from 'react';
import { PRESETS } from '../lib/presets';
import type { PresetModel } from '../lib/presets';
import { decompose } from '../lib/decompose';
import { getColorMap } from '../lib/palette';
import { useStore } from '../lib/store';
import type { BeadModel } from '../lib/types';

const colorMap = getColorMap();

// 缩略图:渲染模型顶层 2D 图纸
function PresetThumbnail({ model }: { model: BeadModel }) {
  const blueprints = useMemo(() => decompose(model), [model]);
  const top = blueprints[blueprints.length - 1] ?? null;
  if (!top || top.count === 0) {
    return <div className="w-full h-20 flex items-center justify-center text-slate-500 text-xs">空</div>;
  }
  const cell = 8;
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${top.width}, ${cell}px)`,
        gridTemplateRows: `repeat(${top.height}, ${cell}px)`,
      }}
    >
      {top.grid.flatMap((row, y) =>
        row.map((colorId, x) => (
          <div
            key={`${x}-${y}`}
            style={{
              width: cell,
              height: cell,
              background: colorId ? colorMap[colorId]?.hex ?? '#ccc' : 'transparent',
              border: '1px solid rgba(100,116,139,0.3)',
            }}
          />
        )),
      )}
    </div>
  );
}

// 单个预设卡片(独立组件,内部可用 hooks)
function PresetCard({ preset, onLoad }: { preset: PresetModel; onLoad: (build: () => BeadModel) => void }) {
  const model = useMemo(() => preset.build(), [preset.id]);
  return (
    <button
      type="button"
      onClick={() => onLoad(preset.build)}
      title={preset.description}
      className="flex flex-col items-center gap-1 p-2 rounded bg-slate-700 hover:bg-slate-600 border border-transparent hover:border-blue-400 transition"
    >
      <div className="w-full h-20 flex items-center justify-center overflow-hidden">
        <PresetThumbnail model={model} />
      </div>
      <span className="text-slate-100 text-xs">{preset.name}</span>
    </button>
  );
}

export default function PresetGallery() {
  const loadModel = useStore((s) => s.loadModel);
  const setCurrentLayer = useStore((s) => s.setCurrentLayer);

  const handleLoad = (build: () => BeadModel) => {
    const model = build();
    const maxZ = model.beads.reduce((m, b) => Math.max(m, b.z), 0);
    loadModel(model);
    setCurrentLayer(maxZ);
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg flex flex-col gap-3">
      <h2 className="text-slate-100 font-semibold">模型库</h2>
      <p className="text-slate-400 text-xs">点击加载预设模型,会替换当前模型</p>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((preset) => (
          <PresetCard key={preset.id} preset={preset} onLoad={handleLoad} />
        ))}
      </div>
    </div>
  );
}
