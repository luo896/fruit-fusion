# 架构设计

## 目标

先实现一个可持续迭代的 H5 原型，不把所有玩法写在一个脚本里。核心逻辑保持数据驱动，方便未来迁移到 Unity 或小游戏平台。

## 模块划分

```text
src/
├── config/        # 水果、生成池、数值配置
├── core/          # 状态机、事件、随机数等通用能力
├── game/          # 应用装配层
├── gameplay/      # 掉落、合成、得分、失败线
└── ui/            # HUD、弹层、按钮
```

## 关键系统

### FruitConfig

水果链配置位于 `src/config/fruits.ts`。新增水果优先改配置，不改合成系统。

### SpawnController

负责玩家输入、当前落点、生成队列和掉落冷却。它不负责合成和得分。

### MergeSystem

负责碰撞后同级合成。它只处理 Matter.js body 和合成事件，不直接更新 UI。

### ScoreSystem

负责本局分数和最高分本地存档。

### FailLineSystem

负责顶部失败判定。水果超过失败线并持续指定时间后触发 Game Over。

### Hud

只负责 DOM 更新，不读取物理世界状态。

## 事件流

```text
玩家点击容器
-> SpawnController 创建水果 Body
-> Matter.js 模拟碰撞
-> MergeSystem 监听 collisionStart
-> 同级水果生成下一级水果
-> ScoreSystem 加分
-> EventBus 通知 HUD
```

## 后续扩展点

- BuffSystem：监听分数节点，暂停游戏并提供三选一。
- SkillSystem：技能通过命令对象影响水果或物理世界。
- StageSystem：切换边界、障碍物、传送门、移动平台。
- Service 层：广告、排行榜、云存档、埋点。
