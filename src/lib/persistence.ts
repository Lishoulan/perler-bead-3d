import type { BeadModel } from './types';

export const STORAGE_KEY = 'perler-bead-3d:model';

// 从 localStorage 读取模型,失败返回 null
export function loadFromStorage(): BeadModel | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BeadModel;
    // 简单的形状校验,避免脏数据导致后续逻辑崩溃
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.beads) &&
      typeof parsed.version === 'number'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

// 将模型写入 localStorage,try/catch 包裹避免配额异常
export function saveToStorage(model: BeadModel): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(model));
  } catch {
    // 忽略配额不足或隐私模式下的写入异常
  }
}
