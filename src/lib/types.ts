// 单颗拼豆:在整数网格坐标 (x, y, z) 上的一个圆柱颗粒,带颜色 ID
export interface Bead {
  x: number;
  y: number;
  z: number;
  colorId: string;
}

// 模型:拼豆集合 + 元信息
export interface BeadModel {
  beads: Bead[];
  // 网格尺寸限制(用于图纸 2D 网格边界)
  // 不强制约束放置,但用于图纸渲染时确定画布大小
  version: number; // 数据版本号,便于未来迁移
}

// 工具模式
export type ToolMode = 'draw' | 'erase';

// 应用主模式
export type AppMode = 'edit' | 'blueprint';

// 调色板颜色定义
export interface PaletteColor {
  id: string;
  name: string;     // 颜色名(中文)
  hex: string;      // hex 颜色值,如 "#FFFFFF"
}

// 单层图纸:z 层号 + 该层的 2D 网格(行= y,列= x),值为颜色 ID 或 null(空)
export interface LayerBlueprint {
  z: number;
  // grid[y][x] = colorId | null
  grid: (string | null)[][];
  // 该层尺寸
  width: number;  // x 方向格子数
  height: number; // y 方向格子数
  // 该层拼豆数
  count: number;
}
