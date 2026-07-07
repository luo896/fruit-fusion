# Fruit Fusion

一个基于物理碰撞的掉落合成游戏原型。当前版本实现的是计划中的技术验证和核心原型：水果掉落、同级合成、分数、最高分、本地存档、失败线、暂停和重开。

## 技术栈

- TypeScript
- Vite
- Matter.js
- Vitest

## 本地运行

```bash
npm install
npm run dev
```

默认地址：

```text
http://127.0.0.1:5173
```

## 公开部署

项目使用 GitHub Pages 部署。推送到 `main` 后，GitHub Actions 会运行类型检查、测试、构建并发布 `dist/`。

预期公开地址：

```text
https://luo896.github.io/fruit-fusion/
```

## 添加到手机主屏幕

项目已经包含 PWA 基础配置：

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- iOS 所需的 `apple-mobile-web-app-*` 和 `apple-touch-icon` meta

使用方式：

- iPhone Safari：打开公开地址，点击分享按钮，选择“添加到主屏幕”。
- Android Chrome：打开公开地址，浏览器通常会显示“安装应用”，也可以从菜单选择“添加到主屏幕”。

## 常用命令

```bash
npm run typecheck
npm test
npm run build
```

## 当前范围

已完成：

- H5 可玩原型
- 8 级水果合成链
- 4 种随机初始水果
- Matter.js 物理碰撞
- 合成判定与分数
- 最高分本地存档
- 顶部失败线
- 暂停、重开、结算弹层
- 基础测试
- 架构、开发规范、路线图文档

暂未包含：

- Roguelike Buff
- 技能系统
- 地图系统
- 排行榜
- 广告商业化
- 云存档

这些功能会在核心手感验证后再进入 Alpha 阶段。
