# Pepper Portfolio

阴天骄（Pepper）的个人作品集网站，集中展示 AI 产品思维、游戏玩法设计、原型验证方法与可运行项目。

## 在线访问

- 正式域名：<https://pepper-portfolio.cn>
- Cloudflare 备用地址：<https://pepper-portfolio.ludo-schema-yintianjiao.workers.dev/>

> 正式域名需在注册完成并通过实名认证后配置 DNS，生效前可继续使用备用地址。

## 本地运行

需要 Node.js `>=22.13.0`。

```bash
pnpm install
pnpm run dev
```

## 验证

```bash
pnpm run build
pnpm test
```

## 部署

- 当前线上版本由 GitHub 仓库自动构建并部署到 Cloudflare Workers。
- 中国大陆服务器部署配置位于 `deploy/mainland/`，完成 ICP 备案后启用。
