# 立体拼豆建模与图纸拆解

一个纯前端 Web 应用,可在浏览器中创建 3D 立体拼豆模型并拆解为分层图纸。无需安装任何客户端,所有操作在浏览器中完成,数据保存在本地。

## 功能特性

- **3D 建模**:基于 Three.js 的 3D 场景,可在三维网格上放置、删除、上色拼豆,自由旋转查看
- **调色板**:内置常用拼豆颜色,支持自定义颜色选取,提供取色与填充工具
- **拆图纸**:一键将 3D 模型按 Z 轴拆解为逐层平面图纸,方便按层拼装
- **颜色统计**:自动统计当前模型各颜色的拼豆用量,辅助备料
- **本地持久化**:作品自动保存到浏览器 localStorage,刷新或关闭页面不丢失
- **JSON 导入导出**:支持将模型导出为 JSON 文件,也可从 JSON 文件导入,便于分享与备份

## 技术栈

- **React 18** + **TypeScript** —— UI 框架与类型安全
- **Vite 5** —— 构建工具与开发服务器
- **Three.js** + **@react-three/fiber** + **@react-three/drei** —— 3D 渲染
- **Tailwind CSS 3** —— 原子化样式
- **zustand** —— 轻量状态管理

## 本地开发

环境要求:Node.js 18+ (推荐 20)。

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

开发服务器启动后,按终端提示在浏览器打开本地地址(默认 http://localhost:5173)。

## 构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录,可直接用任意静态文件服务器托管。预览构建产物:

```bash
npm run preview
```

## GitHub Pages 部署说明

本项目已配置 GitHub Actions 自动部署工作流(见 `.github/workflows/deploy.yml`)。

### 部署步骤

1. **推送代码到 GitHub**:把 `perler-bead-3d` 目录推送到你的 GitHub 仓库。可以直接把本目录作为仓库根,也可以作为仓库的子目录(若作为子目录,工作流文件需位于仓库根的 `.github/workflows/` 下才能被识别)。
2. **配置 Pages 来源**:在仓库 `Settings` → `Pages` → `Source` 中选择 **"GitHub Actions"**。
3. **触发部署**:推送到 `main` 分支后会自动触发 `deploy.yml` 工作流;也可在仓库 `Actions` 页手动触发(`workflow_dispatch`)。
4. **访问站点**:部署完成后通过 `https://<用户名>.github.io/<仓库名>/` 访问。
5. **子路径适配**:Vite 已在 `vite.config.ts` 中配置 `base: './'`,可适配 GitHub Pages 的子路径部署,无需额外修改。

### 工作流说明

- 触发条件:`push` 到 `main` 分支,或手动触发
- 运行环境:`ubuntu-latest`,Node.js 20
- 流程:安装依赖 → `npm run build` → 上传 `dist/` 产物 → 部署到 GitHub Pages
- 并发控制:同一 `pages` 组下的新运行会取消正在进行的旧运行

> 注意:仓库根目录的 `.nojekyll` 文件用于禁用 GitHub Pages 的 Jekyll 处理,避免下划线开头的文件被忽略,请勿删除。

## 截图

(待补充)
