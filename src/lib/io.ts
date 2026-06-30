import type { BeadModel } from './types';

// 将模型导出为 JSON 文件下载
export function exportModelToFile(model: BeadModel): void {
  const json = JSON.stringify(model, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'perler-bead-model.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 从用户选择的文件读取并校验模型
export async function importModelFromFile(file: File): Promise<BeadModel> {
  const text = await file.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('文件不是合法的 JSON');
  }
  if (
    !data ||
    typeof data !== 'object' ||
    !Array.isArray((data as { beads?: unknown }).beads)
  ) {
    throw new Error('无效的拼豆模型文件:缺少 beads 数组');
  }
  return data as BeadModel;
}
