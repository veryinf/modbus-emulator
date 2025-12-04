# Modbus 模拟器

一个支持多从站设备的 Modbus TCP 模拟器，提供 HTTP API 接口用于管理和控制模拟设备。

## 功能特性

- ✅ 支持同时模拟多个 Modbus 从站设备
- ✅ 支持 4 种 Modbus 数据类型：
  - Coils (线圈，可读写)
  - Discrete Inputs (离散输入，只读)
  - Holding Registers (保持寄存器，可读写)
  - Input Registers (输入寄存器，只读)
- ✅ RESTful HTTP API 接口
- ✅ 实时查询和设置设备数据

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
- HTTP API 服务器监听端口：**3000**

## API 接口文档

### 从站管理

#### 获取所有从站列表
```http
GET /api/slaves
```

响应示例：
```json
{
  "success": true,
  "data": [
    { "slaveId": 1, "status": "active" },
    { "slaveId": 2, "status": "active" }
  ]
}
```

#### 获取从站信息
```http
GET /api/slaves/:slaveId
```

#### 创建新从站
```http
POST /api/slaves
Content-Type: application/json

{
  "slaveId": 2,  // 可选，不提供则自动分配
  "initPoints": {
    "coils": [{ "address": 0, "value": false }],
    "discreteInputs": [{ "address": 0, "value": true }],
    "holdingRegisters": [{ "address": 0, "value": 0x00fc }],
    "inputRegisters": [{ "address": 0, "value": 0x0000 }]
  }
}
```

#### 删除从站
```http
DELETE /api/slaves/:slaveId
```

### 数据操作

#### Coils (线圈)

**查询 Coils 数据**
```http
GET /api/slaves/:slaveId/coils
GET /api/slaves/:slaveId/coils?address=0&length=10  # 查询指定范围
```

**设置 Coils 数据**
```http
POST /api/slaves/:slaveId/coils
Content-Type: application/json

# 单个设置
{
  "address": 0,
  "value": true
}

# 批量设置
{
  "data": [
    { "address": 0, "value": true },
    { "address": 1, "value": false }
  ]
}
```

#### Discrete Inputs (离散输入)

```http
GET /api/slaves/:slaveId/discrete-inputs
POST /api/slaves/:slaveId/discrete-inputs
```

#### Holding Registers (保持寄存器)

```http
GET /api/slaves/:slaveId/holding-registers
POST /api/slaves/:slaveId/holding-registers
```

#### Input Registers (输入寄存器)

```http
GET /api/slaves/:slaveId/input-registers
POST /api/slaves/:slaveId/input-registers
```

## 使用示例

### 使用 curl

```bash
# 获取所有从站
curl http://localhost:3000/api/slaves

# 获取从站 1 的所有数据
curl http://localhost:3000/api/slaves/1

# 设置从站 1 的 Coil 0 为 true
curl -X POST http://localhost:3000/api/slaves/1/coils \
  -H "Content-Type: application/json" \
  -d '{"address": 0, "value": true}'

# 设置从站 1 的 Holding Register 0 为 0x1234
curl -X POST http://localhost:3000/api/slaves/1/holding-registers \
  -H "Content-Type: application/json" \
  -d '{"address": 0, "value": 4660}'

# 创建新从站
curl -X POST http://localhost:3000/api/slaves \
  -H "Content-Type: application/json" \
  -d '{"slaveId": 2, "initPoints": {"coils": [{"address": 0, "value": false}]}}'
```

## 技术栈

- **运行时**: Bun v1.2.10
- **语言**: TypeScript
- **Modbus 库**: njs-modbus
- **HTTP 服务器**: Bun.serve (Bun 原生 HTTP 服务器)

## 项目结构

```
emulator/
├── src/
│   ├── app.ts          # 主程序（多从站管理 + HTTP API）
│   ├── power-mock.ts   # 异步版本从站模拟器
│   └── server.ts       # TCP 服务器
├── package.json
├── tsconfig.json
└── README.md
```
