import type { BeadModel, LayerBlueprint } from './types';

// 将 3D 模型按 z 层切片,返回从底到顶排序的 LayerBlueprint[]
export function decompose(model: BeadModel): LayerBlueprint[] {
  if (!model.beads || model.beads.length === 0) return [];

  // 1. 收集所有出现过的 z 值(升序)与全局 x、y 范围
  const zSet = new Set<number>();
  let maxX = -1;
  let maxY = -1;
  for (const bead of model.beads) {
    zSet.add(bead.z);
    if (bead.x > maxX) maxX = bead.x;
    if (bead.y > maxY) maxY = bead.y;
  }
  const zList = Array.from(zSet).sort((a, b) => a - b);

  const width = maxX + 1;
  const height = maxY + 1;
  // width/height 为 0 时(理论上 beads 非空不会发生),跳过
  if (width <= 0 || height <= 0) return [];

  // 2. 对每个 z 层构建 grid:height 行 × width 列,初始化 null
  const blueprints: LayerBlueprint[] = [];
  for (const z of zList) {
    const grid: (string | null)[][] = [];
    for (let y = 0; y < height; y++) {
      grid.push(new Array(width).fill(null));
    }
    let count = 0;
    for (const bead of model.beads) {
      if (bead.z !== z) continue;
      // 越界保护(理论不会触发)
      if (bead.x < 0 || bead.x >= width || bead.y < 0 || bead.y >= height) continue;
      grid[bead.y][bead.x] = bead.colorId;
      count++;
    }
    blueprints.push({ z, grid, width, height, count });
  }

  return blueprints;
}
