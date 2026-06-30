import { create } from 'zustand';
import type { AppMode, Bead, BeadModel, ToolMode } from './types';
import { PALETTE } from './palette';
import { loadFromStorage, saveToStorage } from './persistence';

interface StoreState {
  // 状态
  model: BeadModel;
  currentColorId: string;
  tool: ToolMode;
  appMode: AppMode;
  currentLayer: number;
  currentLayerIndex: number;

  // 操作
  placeBead: (x: number, y: number) => void;
  eraseBead: (x: number, y: number) => void;
  setBead: (b: Bead) => void;
  removeBeadAt: (x: number, y: number, z: number) => void;
  clearModel: () => void;
  setColor: (id: string) => void;
  setTool: (t: ToolMode) => void;
  setAppMode: (m: AppMode) => void;
  setCurrentLayer: (z: number) => void;
  setCurrentLayerIndex: (i: number) => void;
  loadModel: (model: BeadModel) => void;
  getModel: () => BeadModel;
}

// 初始模型:优先从 localStorage 恢复,否则使用空模型
const initialModel: BeadModel = loadFromStorage() ?? { beads: [], version: 1 };

export const useStore = create<StoreState>((set, get) => ({
  model: initialModel,
  currentColorId: PALETTE[0].id,
  tool: 'draw',
  appMode: 'edit',
  currentLayer: 0,
  currentLayerIndex: 0,

  placeBead: (x, y) => {
    set((state) => {
      const z = state.currentLayer;
      // 移除同坐标已有拼豆后追加新拼豆,保证同坐标唯一
      const beads = state.model.beads.filter(
        (b) => !(b.x === x && b.y === y && b.z === z),
      );
      beads.push({ x, y, z, colorId: state.currentColorId });
      return { model: { ...state.model, beads } };
    });
    saveToStorage(get().model);
  },

  eraseBead: (x, y) => {
    set((state) => {
      const z = state.currentLayer;
      const beads = state.model.beads.filter(
        (b) => !(b.x === x && b.y === y && b.z === z),
      );
      return { model: { ...state.model, beads } };
    });
    saveToStorage(get().model);
  },

  setBead: (b) => {
    set((state) => {
      const beads = state.model.beads.filter(
        (existing) => !(existing.x === b.x && existing.y === b.y && existing.z === b.z),
      );
      beads.push(b);
      return { model: { ...state.model, beads } };
    });
    saveToStorage(get().model);
  },

  removeBeadAt: (x, y, z) => {
    set((state) => {
      const beads = state.model.beads.filter(
        (b) => !(b.x === x && b.y === y && b.z === z),
      );
      return { model: { ...state.model, beads } };
    });
    saveToStorage(get().model);
  },

  clearModel: () => {
    set((state) => ({ model: { ...state.model, beads: [] } }));
    saveToStorage(get().model);
  },

  setColor: (id) => set({ currentColorId: id }),

  setTool: (t) => set({ tool: t }),

  setAppMode: (m) => set({ appMode: m }),

  setCurrentLayer: (z) => {
    if (z < 0) return;
    set({ currentLayer: z });
  },

  setCurrentLayerIndex: (i) => set({ currentLayerIndex: i }),

  loadModel: (model) => {
    set({ model });
    saveToStorage(get().model);
  },

  getModel: () => get().model,
}));
