# 使用 Bun 官方镜像作为基础镜像
FROM docker.1ms.run/oven/bun:latest

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 bun.lock 文件
COPY package.json bun.lock ./

# 安装依赖
RUN bun install --production

# 复制源代码
COPY src ./src

# 复制配置文件（如果存在）
COPY slaves-config.json ./slaves-config.json

# 复制 UI 构建文件（如果存在）
COPY ui/dist ./ui/dist

# 暴露端口
EXPOSE 4000 502

# 启动应用
CMD ["bun", "src/app.ts"]