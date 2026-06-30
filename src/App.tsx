import { useStore } from './lib/store';
import { Scene } from './components/BeadEditor';
import Palette from './components/Palette';
import Toolbar from './components/Toolbar';
import PresetGallery from './components/PresetGallery';
import { BlueprintBrowser } from './components/BlueprintView';

function App() {
  const appMode = useStore((s) => s.appMode);
  const setAppMode = useStore((s) => s.setAppMode);
  const model = useStore((s) => s.model);

  const handleTabBlueprint = () => {
    if (model.beads.length === 0) {
      alert('模型为空,请先建模');
      return;
    }
    setAppMode('blueprint');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 text-slate-100">
      <header className="h-14 flex items-center justify-between px-4 bg-slate-950 border-b border-slate-700">
        <h1 className="text-xl font-bold">立体拼豆建模器</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setAppMode('edit')}
            className={`px-4 py-1.5 rounded ${appMode === 'edit' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            建模
          </button>
          <button
            onClick={handleTabBlueprint}
            className={`px-4 py-1.5 rounded ${appMode === 'blueprint' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            图纸
          </button>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        {appMode === 'edit' ? (
          <>
            <div className="flex-1 relative">
              <Scene />
            </div>
            <aside className="w-80 p-4 flex flex-col gap-4 overflow-y-auto bg-slate-800/50">
              <PresetGallery />
              <Palette />
              <Toolbar />
            </aside>
          </>
        ) : (
          <div className="flex-1 overflow-auto p-6">
            <BlueprintBrowser />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
