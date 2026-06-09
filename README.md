# 🐧 鹅厂实习记 · Tencent Intern Penguin Survival

> 一只打工企鹅的实习求生路。
> 一款致敬《人生重开模拟器》的纯前端文字冒险小游戏，以"鹅厂实习生"为视角讲述 12 周的职场轮回故事。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

> 🚀 **想自己部署？** → 详见 [DEPLOY.md](./DEPLOY.md)（推荐 EdgeOne Pages，5 分钟免费上线）

---

## ✨ 玩法

- 给你的实习企鹅取个名（也可以摇个沙雕名）
- 12 周实习倒计时，每周触发一个事件，做出 2~3 个选择
- 6 项属性：体力 / 智力 / 情商 / 零花 / 导师好感 / 转正进度
- 你的每个选择都在暗中累计 5 条「未来路线」分数：产品鹅 / 设计鹅 / 研发鹅 / 运营鹅 / 职能鹅
- 撑到第 12 周 → 根据**得分最高的路线**决定你转正成哪种鹅
- 中途任何属性归零 → 触发对应失败结局，可转生再战

## 📦 内容量

- **30** 个原创事件（入职 / 任务 / 同事 / 老板 / 健康 / 机会 / 转正答辩）
- **8** 个结局（过劳猝死 · 弹尽粮绝 · 社死毕业 · 提前劝退 · 中途跑路 · 王牌实习生 · 顺利转正 · 实习未通过）
- **5** 个成就
- **8** 张 AI 生成的卡通插画

## 🛠 技术栈

| 层 | 选型 |
|---|---|
| 构建 | Vite 5 |
| 框架 | React 18 + TypeScript（strict） |
| 样式 | Tailwind CSS 3 |
| 状态 | Zustand 4 + persist 中间件 |
| 持久化 | localStorage |
| 部署形态 | 纯前端静态站点 |

## 🚀 本地运行

需要 Node.js 18+。

```bash
npm install
npm run dev
```

打开 http://127.0.0.1:5173/ 即可。

## 📦 构建

```bash
npm run build      # 产物输出到 dist/
npm run preview    # 本地预览构建产物
```

`dist/` 目录是纯静态文件，可以直接丢到任何静态托管平台（Vercel / Netlify / EdgeOne Pages / GitHub Pages 等）。

## 🗂 目录结构

```
src/
├── App.tsx                       # 阶段路由（home / naming / playing / ended）
├── main.tsx / index.css          # 入口 + Tailwind
├── components/
│   ├── Logo.tsx                  # 双行标题
│   ├── Button.tsx / Card.tsx     # 基础组件
│   ├── AttrPanel.tsx             # 属性面板 + 转正进度 + 周数倒计时
│   └── CollectionModal.tsx       # 结局/成就图鉴弹窗
├── screens/
│   ├── HomeScreen.tsx            # 首页（大插图 + CTA + 历世记录）
│   ├── NamingScreen.tsx          # 取名页
│   ├── PlayingScreen.tsx         # 游戏内（事件大图卡 + 影响摘要）
│   └── EndedScreen.tsx           # 结算页
└── game/
    ├── types.ts                  # 类型定义
    ├── tracks.ts                 # 5 条未来路线
    ├── events.ts                 # 30 事件
    ├── endings.ts                # 8 结局 + 5 成就
    ├── nameGen.ts                # 沙雕名生成器
    └── store.ts                  # Zustand store + 核心循环
```

## 🎨 设计原则

本项目遵循 [`CLAUDE.md`](https://github.com/) 风格的协作规范：

1. **Think Before Coding** — 实现前先暴露假设，多解法时不静默选择
2. **Simplicity First** — 不要超出需求的"灵活性"，能 50 行不写 200 行
3. **Surgical Changes** — 只改要改的，不顺手"美化"无关代码
4. **Goal-Driven Execution** — 把任务转成可验证目标，循环到通过

## 🙏 致敬

灵感来自《人生重开模拟器》和「鹅厂求生记」社区作品。
本项目所有事件文案 / 视觉资源均为原创，仅供学习交流。

## 📄 License

[MIT](./LICENSE) © 2026 theAtlantic-zza
