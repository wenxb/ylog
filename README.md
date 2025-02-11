# YLOG

YLOG是一个基于 Next.js 15 开发的个人博客。

## 预览

## 功能特性

- 支持暗黑主题切换
- 随记功能
- 导航链接
- 内置多种工具
- 音乐页面

## 技术栈

- 前端框架: Next.js 15
- 样式工具: Shadcn
- 数据库 ORM: Drizzle
- 数据库: PostgreSQL
- 缓存: Redis

## 开发

1. 克隆仓库：

    ```bash
    git clone https://github.com/wenxb/ylog.git
    ```

2. 安装依赖：

    ```bash
    cd y-blog
    pnpm i
    ```

3. 配置环境变量：
   重命名根目录下的 `.env.example` 为 `.env.local` 并配置相应的数据库和缓存连接等信息。

4. 同步数据库

   ```bash
   pnpm push:local # 开发时
   pnpm push       # 部署时
   ```

5. 运行开发服务器：

    ```bash
    pnpm dev
    ```

   浏览器打开 `http://localhost:10001` 以查看项目。

## 贡献

欢迎提交 Pull Request 来贡献你的代码，或通过 Issues 提出意见或建议。

## 许可证

[MIT License](LICENSE)
