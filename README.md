# friday工具箱

一个纯前端的在线开发者工具集合，所有处理均在浏览器本地完成，无需上传服务器。

## 工具列表（13个）

| 分类 | 工具 | 说明 |
|------|------|------|
| 图片 | SVG → PNG | 粘贴或上传 SVG，自定义尺寸导出 PNG，支持透明背景 |
| 图片 | 图片压缩 | 上传图片，拖动滑块调整质量，实时预览后下载 |
| 图片 | 网站图标获取 | 输入网址自动获取 favicon，支持 SVG/PNG 下载 |
| 文本 | JSON 格式化 / 校验 | 粘贴 JSON，一键格式化或压缩，自动校验语法 |
| 文本 | Base64 编解码 | 文本与 Base64 双向编解码，支持 UTF-8 中文 |
| 文本 | URL 编解码 | encodeURIComponent / decodeURIComponent 双向操作 |
| 文本 | Base64 图片互转 | Base64 ↔ 图片，支持 PNG/JPEG/GIF/WebP/BMP/SVG |
| 文本 | HTTP 头转 JSON | 粘贴原始 HTTP 头，一键转为 JSON / JS 对象 / cURL |
| 文本 | 正则表达式测试 | 实时查看匹配结果与捕获组，支持 g/i/m/s/u 标志位 |
| 文本 | Markdown 预览 | 编写 Markdown，实时预览，支持 GFM 语法 |
| 开发 | 时间戳转换 | Unix 时间戳与日期双向转换，支持秒/毫秒自动识别 |
| 开发 | UUID 生成器 | 一键生成 RFC 9562 标准 UUID v4，支持批量生成 |
| 开发 | 颜色转换器 | HEX / RGB / HSL 互转，内置颜色选择器 |

## 技术栈

- 纯静态 HTML / CSS / JavaScript，无框架依赖
- 所有图片压缩、SVG 渲染、Base64 转换均在浏览器本地完成
- 支持 Cloudflare Workers 部署（`worker.js`）
- Node.js 本地开发服务器（`server.mjs`，含 favicon 代理）

## 快速开始

### 本地运行

```bash
# 方式一：Python 简易服务器
python3 -m http.server 6006

# 方式二：Node.js 服务器（含 favicon 代理）
npm start
```

浏览器打开 `http://localhost:6006`

### Cloudflare Workers 部署

```bash
npm run deploy
```

## 项目结构

```
├── index.html        # 主页面（所有 13 个工具的单文件应用）
├── server.mjs        # Node.js 本地服务器（含 favicon CORS 代理）
├── worker.js         # Cloudflare Workers 入口
├── _worker.js        # Workers 备用入口
├── package.json      # 项目配置
├── wrangler.toml     # Cloudflare Wrangler 配置
├── logo.ico          # 网站图标
└── logo_scan.jpg     # 公众号二维码图片
```

## 特性

- 🔒 **隐私优先** — 图片压缩、SVG 渲染等操作完全在浏览器本地完成
- 📱 **响应式** — 适配桌面端和移动端
- 🎨 **左右分栏** — 侧边栏导航 + 主内容区
- 🌐 **单文件部署** — 仅一个 `index.html` 即可部署到任意静态托管

## 许可

MIT
