# 开发规范和代码规范

## 基本原则

1. 核心玩法数据驱动。
2. 物理逻辑、游戏规则、UI 表现分离。
3. 每个阶段都保持可运行、可测试、可打包。
4. 不在 MVP 前引入复杂商业化、宠物、装备、赛季。
5. 高频逻辑避免 DOM 查询和全场扫描。

## TypeScript 规范

- 开启 `strict`。
- 类名、类型、枚举使用 `PascalCase`。
- 函数和局部变量使用 `camelCase`。
- 私有字段优先使用 `private readonly`，只有必须变化时才去掉 `readonly`。
- 配置对象使用 `readonly` 字段。
- 禁止用字符串散落判断水果类型，统一使用 `FruitId`。

## 模块边界

- `config/` 只放配置和配置查询函数。
- `core/` 不依赖游戏业务。
- `gameplay/` 可以依赖 Matter.js，但不直接操作 DOM。
- `ui/` 可以操作 DOM，但不读取 Matter.js 世界。
- `game/` 是装配层，可以连接 UI、物理、系统和事件。

## 提交规范

```text
feat: add fruit merge system
fix: prevent duplicate merge on same collision
tune: adjust fruit mass and bounce
ui: add game over panel
test: add fruit config tests
docs: add development roadmap
chore: update project scripts
```

## 验证要求

提交前至少运行：

```bash
npm run typecheck
npm test
npm run build
```

如果修改物理参数，还需要人工试玩至少 3 局，确认没有明显穿模、重复合成和失败线误判。
