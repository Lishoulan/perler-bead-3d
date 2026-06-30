import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useStore } from '../lib/store';
import { exportModelToFile, importModelFromFile } from '../lib/io';

function Toolbar() {
  const tool = useStore((s) => s.tool);
  const setTool = useStore((s) => s.setTool);
  const currentLayer = useStore((s) => s.currentLayer);
  const setCurrentLayer = useStore((s) => s.setCurrentLayer);
  const appMode = useStore((s) => s.appMode);
  const setAppMode = useStore((s) => s.setAppMode);
  const clearModel = useStore((s) => s.clearModel);
  const getModel = useStore((s) => s.getModel);
  const loadModel = useStore((s) => s.loadModel);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const model = await importModelFromFile(file);
      loadModel(model);
    } catch (err) {
      alert(`导入失败: ${err instanceof Error ? err.message : String(err)}`);
    }
    // 清空 value 以便重复导入同一文件
    e.target.value = '';
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg flex flex-col gap-3">
      <h2 className="text-slate-100 font-semibold">工具</h2>

      {/* 工具切换 */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setTool('draw')}
          className={`px-3 py-2 rounded text-slate-100 ${tool === 'draw' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
        >
          绘制
        </button>
        <button
          type="button"
          onClick={() => setTool('erase')}
          className={`px-3 py-2 rounded text-slate-100 ${tool === 'erase' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
        >
          橡皮擦
        </button>
      </div>

      {/* 当前层 */}
      <div className="flex flex-col gap-2">
        <span className="text-slate-100">当前层: {currentLayer}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentLayer(Math.max(0, currentLayer - 1))}
            className="flex-1 px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-100"
          >
            上一层
          </button>
          <button
            type="button"
            onClick={() => setCurrentLayer(currentLayer + 1)}
            className="flex-1 px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-100"
          >
            下一层
          </button>
        </div>
        <input
          type="number"
          min={0}
          value={currentLayer}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!Number.isNaN(v) && v >= 0) {
              setCurrentLayer(v);
            }
          }}
          className="px-2 py-1 rounded bg-slate-900 text-slate-100 border border-slate-600"
        />
      </div>

      {/* 清空模型 */}
      <button
        type="button"
        onClick={() => {
          if (confirm('确定清空所有拼豆?')) clearModel();
        }}
        className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-100"
      >
        清空模型
      </button>

      {/* 拆解图纸 / 返回建模 */}
      {appMode === 'blueprint' ? (
        <button
          type="button"
          onClick={() => setAppMode('edit')}
          className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-100"
        >
          返回建模
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setAppMode('blueprint')}
          className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-100"
        >
          拆解图纸
        </button>
      )}

      {/* 导入 */}
      <input
        type="file"
        accept=".json"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-100"
      >
        导入
      </button>

      {/* 导出 */}
      <button
        type="button"
        onClick={() => exportModelToFile(getModel())}
        className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-100"
      >
        导出
      </button>
    </div>
  );
}

export default Toolbar;
