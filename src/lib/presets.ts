import type { Bead, BeadModel } from './types';

// 预设模型定义
export interface PresetModel {
  id: string;
  name: string;
  description: string;
  build: () => BeadModel;
}

// 辅助:用字符图案生成单层拼豆,字符到 colorId 的映射
function layerFromPattern(
  pattern: string[],
  colorMap: Record<string, string>,
  z: number,
  offsetX = 0,
  offsetY = 0,
): Bead[] {
  const beads: Bead[] = [];
  for (let row = 0; row < pattern.length; row++) {
    const line = pattern[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      const colorId = colorMap[ch];
      if (colorId) {
        beads.push({ x: col + offsetX, y: row + offsetY, z, colorId });
      }
    }
  }
  return beads;
}

// 辅助:填充矩形区域
function fillRect(
  x0: number, y0: number, z: number, w: number, h: number, colorId: string,
): Bead[] {
  const beads: Bead[] = [];
  for (let x = x0; x < x0 + w; x++) {
    for (let y = y0; y < y0 + h; y++) {
      beads.push({ x, y, z, colorId });
    }
  }
  return beads;
}

// 1. 立方体 3x3x3(红色实心)
function buildCube(): BeadModel {
  const beads: Bead[] = [];
  for (let z = 0; z < 3; z++) {
    beads.push(...fillRect(0, 0, z, 3, 3, 'red'));
  }
  return { beads, version: 1 };
}

// 2. 金字塔(4 层,沙黄色,底 7x7 顶 1x1)
function buildPyramid(): BeadModel {
  const beads: Bead[] = [];
  const sizes = [7, 5, 3, 1];
  for (let z = 0; z < sizes.length; z++) {
    const size = sizes[z];
    const offset = (7 - size) / 2; // 居中
    beads.push(...fillRect(offset, offset, z, size, size, 'dark-yellow'));
  }
  return { beads, version: 1 };
}

// 3. 圣诞树(绿+棕+顶星)
function buildChristmasTree(): BeadModel {
  const beads: Bead[] = [];
  // 树干 z=0: 棕色 1x1
  beads.push(...fillRect(3, 4, 0, 1, 1, 'brown'));
  // 树叶层 z=1: 5x3, z=2: 3x2, z=3: 1x1,全部绿色,居中 x=3
  beads.push(...fillRect(1, 1, 1, 5, 3, 'green'));
  beads.push(...fillRect(2, 1, 2, 3, 2, 'dark-green'));
  beads.push(...fillRect(3, 1, 3, 1, 1, 'green'));
  // 顶星 z=4: 黄色 1x1
  beads.push({ x: 3, y: 1, z: 4, colorId: 'yellow' });
  return { beads, version: 1 };
}

// 4. 心形(红色,单层 z=0)
function buildHeart(): BeadModel {
  const pattern = [
    '.XX.XX.',
    'XXXXXXX',
    'XXXXXXX',
    '.XXXXX.',
    '..XXX..',
    '...X...',
  ];
  const beads = layerFromPattern(pattern, { X: 'red' }, 0);
  return { beads, version: 1 };
}

// 5. 小蘑菇(白杆+红伞+白点)
function buildMushroom(): BeadModel {
  const beads: Bead[] = [];
  // z=0 白色杆: x=2, y=3-4
  beads.push(...fillRect(2, 3, 0, 1, 2, 'white'));
  // z=1 红色伞底: y=2, x=0-4
  beads.push(...fillRect(0, 2, 1, 5, 1, 'red'));
  // z=2 红色伞顶: y=1, x=0-4,中间白点
  beads.push(...fillRect(0, 1, 2, 5, 1, 'red'));
  beads.push({ x: 2, y: 1, z: 2, colorId: 'white' }); // 白点
  // z=3 红色伞尖: y=1, x=1-3
  beads.push(...fillRect(1, 1, 3, 3, 1, 'red'));
  return { beads, version: 1 };
}

// 6. 笑脸(黄色圆+黑眼+黑嘴,单层 z=0,7x7)
function buildSmiley(): BeadModel {
  // Y=黄脸,B=黑眼/黑嘴,.=空
  const pattern = [
    '.YYYYY.',
    'YYYYYYY',
    'YYBYBYY',
    'YYYYYYY',
    'Y.BBB.Y',
    'YY...YY',
    '.YYYYY.',
  ];
  const colorMap: Record<string, string> = {
    Y: 'yellow',
    B: 'black',
  };
  const beads = layerFromPattern(pattern, colorMap, 0);
  return { beads, version: 1 };
}

// 7. 小房子(墙+屋顶+门)
function buildHouse(): BeadModel {
  const beads: Bead[] = [];
  // z=0 墙身: 5x3 浅黄,中间挖门(棕色)
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 3; y++) {
      if (x >= 2 && x <= 2 && y >= 1) {
        beads.push({ x, y, z: 0, colorId: 'brown' }); // 门
      } else {
        beads.push({ x, y, z: 0, colorId: 'light-yellow' }); // 墙
      }
    }
  }
  // z=1 墙身第二层: 5x3 浅黄(无门)
  beads.push(...fillRect(0, 0, 1, 5, 3, 'light-yellow'));
  // z=2 屋顶: 三角形,红色
  // y=0: x=0-4, y=1: x=1-3, y=2: x=2
  beads.push(...fillRect(0, 0, 2, 5, 1, 'red'));
  beads.push(...fillRect(1, 1, 2, 3, 1, 'red'));
  beads.push({ x: 2, y: 2, z: 2, colorId: 'red' });
  return { beads, version: 1 };
}

// 8. 数字 8 字(双层蛋糕,粉白)
function buildBirthdayCake(): BeadModel {
  const beads: Bead[] = [];
  // z=0 底层蛋糕: 5x3 粉色
  beads.push(...fillRect(0, 0, 0, 5, 3, 'pink'));
  // z=1 顶层蛋糕: 3x2 白色
  beads.push(...fillRect(1, 0, 1, 3, 2, 'white'));
  // z=2 蜡烛: 黄色 1x1
  beads.push({ x: 2, y: 0, z: 2, colorId: 'yellow' });
  // z=3 火焰: 橙色 1x1
  beads.push({ x: 2, y: 0, z: 3, colorId: 'orange' });
  return { beads, version: 1 };
}

export const PRESETS: PresetModel[] = [
  { id: 'cube', name: '立方体', description: '3x3x3 红色实心立方体', build: buildCube },
  { id: 'pyramid', name: '金字塔', description: '4 层沙黄色金字塔', build: buildPyramid },
  { id: 'tree', name: '圣诞树', description: '绿叶棕干黄星', build: buildChristmasTree },
  { id: 'heart', name: '心形', description: '红色单层心形', build: buildHeart },
  { id: 'mushroom', name: '小蘑菇', description: '白杆红伞白点', build: buildMushroom },
  { id: 'smiley', name: '笑脸', description: '黄圆黑眼黑嘴', build: buildSmiley },
  { id: 'house', name: '小房子', description: '黄墙红顶棕门', build: buildHouse },
  { id: 'cake', name: '生日蛋糕', description: '粉白双层黄烛', build: buildBirthdayCake },
];
