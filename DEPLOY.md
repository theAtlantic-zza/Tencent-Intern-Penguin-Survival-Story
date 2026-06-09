# 部署指南：EdgeOne Pages（推荐）

> 总成本：**0 元**。流程：5 分钟点几下，之后每次 `git push` 自动重新部署。

---

## 步骤 1：注册腾讯云账号（已有可跳过）

1. 打开 https://cloud.tencent.com
2. 微信扫码登录即可（个人账号免费、不需要实名也能用 EdgeOne Pages）

## 步骤 2：进入 EdgeOne Pages 控制台

直接访问：https://console.cloud.tencent.com/edgeone/pages

或：腾讯云控制台 → 搜索"EdgeOne Pages" → 进入

## 步骤 3：创建项目

1. 点右上角「**创建项目**」
2. 选择「**从 Git 导入**」
3. 选「**GitHub**」→ 点「授权 GitHub 账号」
4. 弹出 GitHub 授权页，登录后点「Authorize」（允许 EdgeOne 读取你的仓库）
5. 回到 EdgeOne，选仓库：`theAtlantic-zza/Tencent-Intern-Penguin-Survival-Story`

## 步骤 4：配置构建（一般会自动识别）

| 字段 | 填什么 |
|---|---|
| **项目名称** | `penguin-intern`（或随便填） |
| **生产分支** | `main` |
| **框架预设** | `Vite`（一般会自动识别） |
| **构建命令** | `npm run build` |
| **输出目录** | `dist` |
| **Node 版本** | `20`（推荐） |
| **环境变量** | 不需要填 |

> 项目里已有 `edgeone.json` 配置文件，平台会自动读取，路由/缓存策略都已预设好。

## 步骤 5：部署

1. 点「**开始部署**」
2. 等 1~2 分钟构建完成
3. 拿到一个域名形如：`penguin-intern-xxxxx.edgeone.app`
4. 直接打开就能玩

## 步骤 6（可选）：绑定自定义域名

如果你有自己的域名（比如 `xxx.com`）：

1. 部署详情页 → 「域名管理」→「添加自定义域名」
2. 输入你的域名（**国内域名需要先备案**，国外域名不用）
3. 按提示去你的域名服务商加 CNAME 记录
4. 等 5~10 分钟生效，HTTPS 证书自动签发

---

## 之后怎么更新

**完全不用管 EdgeOne 了**，每次代码改完：

```bash
git add .
git commit -m "你的改动说明"
git push
```

EdgeOne 检测到 `main` 分支有新 commit，**自动重新构建部署**，1~2 分钟后线上就更新了。控制台还能看到每次部署历史，出问题可以一键回滚。

---

## 备选方案

### Vercel（操作几乎一样，但国内访问慢）

1. https://vercel.com 用 GitHub 登录
2. 点 Import Project → 选你仓库
3. 默认配置直接 Deploy

**缺点**：国内有时打不开，CDN 节点在国外。

### GitHub Pages（完全国外服务）

需要在仓库加一个 `.github/workflows/deploy.yml`，配 GitHub Actions 推到 `gh-pages` 分支。

**缺点**：国内访问慢且不稳定，路径要配 `base` 比较麻烦。

### 腾讯云 CloudBase

控制台 → CloudBase → 静态网站托管 → 上传 `dist/` 文件夹。

**缺点**：免费额度 1GB 存储 / 5GB 月流量较小，要绑域名必须备案，**没有 GitHub 自动部署**（每次要手动上传）。

---

## 推荐选择

| 你是这种情况 | 选这个 |
|---|---|
| 国内朋友为主、要分享 | **EdgeOne Pages** ⭐ |
| 国外用户为主 | Vercel |
| 只是个人玩玩、不在意访问速度 | GitHub Pages |

> 默认推荐 EdgeOne，理由：免费额度大、国内最快、原网站同款、零运维。
