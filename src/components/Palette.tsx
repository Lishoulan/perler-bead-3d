import { PALETTE } from '../lib/palette';
import { useStore } from '../lib/store';

function Palette() {
  const currentColorId = useStore((s) => s.currentColorId);
  const setColor = useStore((s) => s.setColor);

  return (
    <div className="bg-slate-800 p-4 rounded-lg flex flex-col gap-3">
      <h2 className="text-slate-100 font-semibold">颜色</h2>
      <div className="grid grid-cols-6 gap-2">
        {PALETTE.map((color) => {
          const selected = color.id === currentColorId;
          return (
            <button
              key={color.id}
              type="button"
              title={color.name}
              aria-label={color.name}
              aria-pressed={selected}
              onClick={() => setColor(color.id)}
              className={`w-8 h-8 rounded border-2 ${selected ? 'border-white ring-2 ring-white' : 'border-transparent'}`}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Palette;
