# 中国大陆部署

该配置用于把 pepper-portfolio 部署到已经完成 ICP 备案的中国大陆服务器。
它不会影响现有 Cloudflare 部署。

## 前提

- 已实名认证的腾讯云账号
- 已实名认证且完成 ICP 备案的域名
- 腾讯云中国大陆轻量应用服务器（Ubuntu，至少 2 GB 内存）
- 域名 A 记录已指向服务器公网 IP
- 服务器防火墙已放行 TCP 80、TCP 443 和 UDP 443

## 首次部署

在服务器中安装 Git 与 Docker，然后克隆 GitHub 仓库。仓库当前项目位于
`Resume-Web` 子目录，进入该目录后执行：

```bash
cp .env.mainland.example .env
```

编辑 `.env`，将 `SITE_ADDRESS` 改成已经备案并解析到服务器的域名，然后执行：

```bash
docker compose -f docker-compose.mainland.yml up -d --build
```

Caddy 会自动申请并续期 HTTPS 证书。

## 更新网站

```bash
git pull
docker compose -f docker-compose.mainland.yml up -d --build
```

## 查看状态

```bash
docker compose -f docker-compose.mainland.yml ps
docker compose -f docker-compose.mainland.yml logs --tail=100
```
