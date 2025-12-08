# Modbus Emulator UI

Modbus设备模拟器的Web用户界面，基于React 19、TanStack Router和TailwindCSS构建。

## 功能特点

- 查看Modbus从站设备列表及其基本信息
- 实时监控和修改设备点位数据
  - 支持线圈(Coils)
  - 支持离散输入(Discrete Inputs)
  - 支持保持寄存器(Holding Registers)
  - 支持输入寄存器(Input Registers)
- 多种数据显示格式（二进制、十进制、十六进制）
- Server-Sent Events (SSE) 实时数据更新
- 响应式UI设计

## 技术栈

- [React 19](https://react.dev/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)

## 快速开始

### 开发环境

确保你的系统已经安装了Node.js和pnpm。

1. 克隆项目代码
2. 安装依赖：

```bash
pnpm install
```

3. 启动开发服务器：

```bash
pnpm dev
```

默认情况下，应用将在 [http://localhost:3080](http://localhost:3080) 上运行。

### 构建生产版本

```bash
pnpm build
```

构建后的静态资源将生成在 `dist` 目录中。

### 测试

使用 Vitest 运行测试：

```bash
pnpm test
```

## 项目结构

```
src/
├── components/           # 共用组件
│   └── ui/               # UI组件（来自shadcn/ui）
├── routes/               # 页面路由
│   ├── index.tsx         # 首页
│   └── devices.$deviceId.tsx # 设备详情页
├── services/             # API服务层
├── lib/                  # 工具库
└── main.tsx             # 应用入口文件
```

## API 接口

应用通过RESTful API与后端通信，接口定义请参考 [openapi.yaml](openapi.yaml) 文件。

主要接口包括：

- `GET /api/slaves` - 获取所有设备基础信息
- `GET /api/slaves/{slaveId}` - 获取指定设备详细信息
- `GET /api/slaves/{slaveId}/subscribe` - 订阅设备点位数据变更事件(SSE)
- `POST /api/slaves/{slaveId}/set-point` - 设置单个点位数据

## 使用说明

1. 首页会显示欢迎信息，提示从设备列表菜单查看设备资料
2. 通过设备列表进入具体设备页面
3. 在设备页面可以：
   - 查看设备基本信息（设备ID、协议类型等）
   - 切换查看不同类型的数据点（线圈、寄存器等）
   - 设置数据显示格式（二进制、十进制、十六进制）
   - 指定地址范围过滤显示
   - 实时查看数据变化
   - 修改点位数据
   - 复制点位值到剪贴板

## 贡献指南

欢迎提交Issue和Pull Request来改进本项目。

## 许可证

[MIT](LICENSE)
