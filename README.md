# Modbus 模拟器

[![Demo](https://img.shields.io/badge/demo-online-green)](https://emulator.chuangyun.work/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Bun](https://img.shields.io/badge/bun-%5E1.0.0-orange)](https://bun.sh)

一个支持多从站设备的 Modbus TCP 模拟器，提供 HTTP API 接口用于管理和控制模拟设备。

## 在线使用

直接在线访问，并可以支持 Modbus 主站远程连接
[https://emulator.chuangyun.work/](https://emulator.chuangyun.work/)

## 功能特性

- ✅ 支持同时模拟多个 Modbus 从站设备
- ✅ 支持 4 种 Modbus 数据类型：
  - Coils (线圈，可读写)
  - Discrete Inputs (离散输入，只读)
  - Holding Registers (保持寄存器，可读写)
  - Input Registers (输入寄存器，只读)
- ✅ RESTful HTTP API 接口
- ✅ 实时查询和设置设备数据
- ✅ Server-Sent Events (SSE) 实时数据点变更通知
- ✅ 配置文件初始化从站设备

## 安装依赖

```bash
bun install
```

## 运行

```bash
bun run src/app.ts
```

启动后：

- Modbus TCP 服务器监听端口：**502**
- HTTP API 服务器监听端口：**4000**

## API 接口文档

### 从站管理

#### 获取所有从站列表

```http
GET /api/slaves
```

响应示例：

```json
{
  "errCode": 0,
  "errMsg": "ok",
  "dataSet": [
    { 
      "slaveId": 1, 
      "title": "默认从站",
      "protocol": "modbus-tcp"
    },
    { 
      "slaveId": 2, 
      "title": "默认从站2",
      "protocol": "modbus-rtuOverTcp"
    }
  ]
}
```

#### 获取从站信息

```http
GET /api/slaves/:slaveId
```

响应示例：

```json
{
  "errCode": 0,
  "errMsg": "ok",
  "data": {
    "slaveId": 1,
    "title": "默认从站",
    "protocol": "modbus-tcp",
    "points": {
      "coils": [
        { "address": 0, "value": false }
      ],
      "discreteInputs": [
        { "address": 0, "value": false }
      ],
      "holdingRegisters": [
        { "address": 0, "value": 65532 }
      ],
      "inputRegisters": [
        { "address": 0, "value": 0 }
      ]
    }
  }
}
```

### 数据操作

#### 设置单个点位数据

```http
POST /api/slaves/:slaveId/set-point
Content-Type: application/json
```

请求体：

```json
{
  "type": "coils",             // 数据类型: coils, discreteInputs, holdingRegisters, inputRegisters
  "address": 0,                // 地址
  "value": true                // 值
}
```

响应示例：

```json
{
  "errCode": 0,
  "errMsg": "ok"
}
```

#### 订阅数据点变更事件

```http
GET /api/slaves/:slaveId/subscribe
```

使用 Server-Sent Events (SSE) 实时接收数据点变更通知。

响应示例：

```text
data: {"type":"pointChange","slaveId":1,"pointType":"coils","address":0,"value":true}
```

### 静态资源

```http
GET /*
```

提供UI静态资源访问。

## 使用示例

### 使用 curl

```bash
# 获取所有从站
curl http://localhost:4000/api/slaves

# 获取从站 1 的所有数据
curl http://localhost:4000/api/slaves/1

# 设置从站 1 的 Coil 0 为 true
curl -X POST http://localhost:4000/api/slaves/1/set-point \
  -H "Content-Type: application/json" \
  -d '{"type": "coils", "address": 0, "value": true}'

# 设置从站 1 的 Holding Register 0 为 255
curl -X POST http://localhost:4000/api/slaves/1/set-point \
  -H "Content-Type: application/json" \
  -d '{"type": "holdingRegisters", "address": 0, "value": 255}'

# 订阅从站 1 的数据点变更事件
curl http://localhost:4000/api/slaves/1/subscribe
```

## 技术栈

- **运行时**: [Bun](https://bun.sh)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **Modbus 库**: [njs-modbus](https://github.com/MaxMech/njs-modbus)
- **HTTP 服务器**: Bun.serve (Bun 原生 HTTP 服务器)
- **数据验证**: [Zod](https://zod.dev/)

## 项目结构

```
emulator/
├── src/
│   ├── app.ts                    # 主程序（多站管理 + HTTP API）
│   ├── power-mock.ts             # 异步版本从站模拟器
│   ├── server.ts                 # TCP 服务器
│   ├── slave-manager.ts          # 从站管理器
│   ├── types.ts                  # 类型定义
│   ├── config-validator.ts       # 配置验证器
│   ├── api/
│   │   ├── router.ts             # API路由
│   │   └── handlers/
│   │       └── slaves.ts         # 从站处理器
│   └── ui/                       # 前端界面
├── package.json
├── tsconfig.json
├── slaves-config.json            # 从站配置文件
└── README.md
```

## 配置文件

项目支持通过 `slaves-config.json` 文件初始化从站设备，启动时会自动加载该文件中的配置。

## Go语言版本

本项目同时提供了一个Go语言实现的版本，位于 [go](./go/) 目录下，具有相同的API接口和功能。

## 许可证

MIT