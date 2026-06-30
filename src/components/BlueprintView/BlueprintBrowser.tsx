import { useMemo } from 'react';
import { useStore } from '../../lib/store';
import { decompose } from '../../lib/decompose';
import BlueprintCanvas from './BlueprintCanvas';
import ColorStats from './ColorStats';

function BlueprintBrowser() {
  const model = useStore((s) => s.model);
  const currentLayerIndex = useStore((s) => s.currentLayerIndex);
  const setCurrentLayerIndex = useStore((s) => s.setCurrentLayerIndex);
  const setAppMode = useStore((s) => s.setAppMode);

  const blueprints = useMemo(() => decompose(model), [model]);

  if (blueprints.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-300 bg-slate-900">
        <p>模型为空,无法拆解</p>
        <button
          type="button"
          onClick={() => setAppMode('edit')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white"
        >
          返回建模
        </button>
      </div>
    );
  }

  const idx = Math.min(currentLayerIndex, blueprints.length - 1);
  const current = blueprints[idx];

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-auto bg-slate-900 text-white">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setAppMode('edit')}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm"
        >
          返回建模
        </button>
        <h1 className="text-lg font-semibold">拆图纸</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setCurrentLayerIndex(Math.max(0, idx - 1))}
          disabled={idx === 0}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed rounded text-sm"
        >
          上一张
        </button>
        <span className="text-slate-200">
          第 {idx + 1} / {blueprints.length} 层
        </span>
        <button
          type="button"
          onClick={() =>
            setCurrentLayerIndex(Math.min(blueprints.length - 1, idx + 1))
          }
          disabled={idx === blueprints.length - 1}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed rounded text-sm"
        >
          下一张
        </button>
      </div>

      <div className="flex flex-row gap-6 flex-wrap">
        <div className="bg-slate-800 p-4 rounded-lg overflow-auto">
          <BlueprintCanvas blueprint={current} />
        </div>
        <ColorStats blueprints={blueprints} />
      </div>
    </div>
  );
}

export default BlueprintBrowser;
