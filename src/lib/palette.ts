import type { PaletteColor } from './types';

// 拼豆调色板预设:24 种常见颜色
// id 采用稳定的语义化命名,便于模型数据迁移与跨设备共享
export const PALETTE: PaletteColor[] = [
  { id: 'white', name: '白色', hex: '#FFFFFF' },
  { id: 'black', name: '黑色', hex: '#1A1A1A' },
  { id: 'red', name: '红色', hex: '#E53935' },
  { id: 'orange', name: '橙色', hex: '#FB8C00' },
  { id: 'yellow', name: '黄色', hex: '#FDD835' },
  { id: 'light-yellow', name: '浅黄', hex: '#FFF59D' },
  { id: 'dark-yellow', name: '深黄', hex: '#F9A825' },
  { id: 'light-green', name: '浅绿', hex: '#AED581' },
  { id: 'green', name: '绿色', hex: '#43A047' },
  { id: 'dark-green', name: '深绿', hex: '#1B5E20' },
  { id: 'olive', name: '橄榄绿', hex: '#6B8E23' },
  { id: 'light-blue', name: '浅蓝', hex: '#81D4FA' },
  { id: 'blue', name: '蓝色', hex: '#1E88E5' },
  { id: 'dark-blue', name: '深蓝', hex: '#1565C0' },
  { id: 'navy', name: '藏青', hex: '#0D1B4A' },
  { id: 'purple', name: '紫色', hex: '#8E24AA' },
  { id: 'pink', name: '粉色', hex: '#F06292' },
  { id: 'light-pink', name: '浅粉', hex: '#F8BBD0' },
  { id: 'brown', name: '棕色', hex: '#795548' },
  { id: 'light-brown', name: '浅棕', hex: '#A1887F' },
  { id: 'dark-brown', name: '深棕', hex: '#4E342E' },
  { id: 'gray', name: '灰色', hex: '#757575' },
  { id: 'light-gray', name: '浅灰', hex: '#BDBDBD' },
  { id: 'skin', name: '肉色', hex: '#FFCCB6' },
];

// 颜色查询映射: id -> PaletteColor
export function getColorMap(): Record<string, PaletteColor> {
  const map: Record<string, PaletteColor> = {};
  for (const color of PALETTE) {
    map[color.id] = color;
  }
  return map;
}
