# API文档

本文档描述了Modbus从站模拟器提供的HTTP API端点。

## 基础URL

所有API端点都相对于以下基础URL：
```
http://localhost:4000/api/
```

## API端点

### 1. 获取所有从站

**端点：** `GET /slaves`

**描述：** 获取所有已配置的Modbus从站设备列表。

**响应格式：**
```json
{
  "errCode": 0,
  "errMsg": "ok",
  "dataSet": [
    {
      "slaveId": 1,
      "title": "PLC模拟器",
      "protocol": "tcp"
    },
    {
      "slaveId": 2,
      "title": "RTU设备",
      "protocol": "rtu-over-tcp"
    }
  ]
}
```

### 2. 获取从站详情

**端点：** `GET /slaves/:slaveId`

**描述：** 获取特定Modbus从站设备的详细信息。

**参数：**
- `slaveId` (路径参数)：要获取的从站设备ID

**响应格式：**
```json
{
  "errCode": 0,
  "errMsg": "ok",
  "data": {
    "slaveId": 1,
    "title": "PLC模拟器",
    "protocol": "tcp",
    "points": {
      "coils": null,
      "discreteInputs": null,
      "holdingRegisters": null,
      "inputRegisters": null
    }
  }
}
```

### 3. 设置数据点值

**端点：** `POST /slaves/:slaveId/set-point`

**描述：** 设置从站设备上特定数据点（线圈、离散输入、输入寄存器或保持寄存器）的值。

**参数：**
- `slaveId` (路径参数)：从站设备的ID

**请求体：**
```json
{
  "type": "holdingRegisters",
  "address": 0,
  "value": 1234
}
```

**请求体参数：**
- `type`：数据点类型（"coils"、"discreteInputs"、"inputRegisters" 或 "holdingRegisters"）
- `address`：数据点地址
- `value`：数据点的新值
  - 对于线圈：整数（0或1）
  - 对于离散输入：整数（0或1）
  - 对于输入寄存器：整数（0-65535）
  - 对于保持寄存器：整数（0-65535）

**响应格式：**
```json
{
  "errCode": 0,
  "errMsg": "ok"
}
```

### 4. 订阅数据点变化

**端点：** `GET /slaves/:slaveId/subscribe`

**描述：** 建立Server-Sent Events (SSE) 连接，当数据点值变化时接收实时通知。

**参数：**
- `slaveId` (路径参数)：要订阅的从站设备ID

**响应格式：**

响应是一个SSE事件流。每个事件都是一个JSON对象，格式如下：

```json
data: {
  "type": "pointChange",
  "slaveId": 1,
  "pointType": "holdingRegisters",
  "address": 0,
  "value": 1234
}

```

**事件格式：**
- `type`：始终为 "pointChange"，表示数据点变化事件
- `slaveId`：从站设备的ID
- `pointType`：数据点类型（"coils" 或 "holdingRegisters"）
- `address`：数据点地址
- `value`：数据点的新值

## 响应格式

所有API响应都遵循标准格式：

```json
{
  "errCode": 0,
  "errMsg": "ok",
  "data": {},
  "dataSet": []
}
```

**响应字段：**
- `errCode`：错误代码（0表示成功，非0表示错误）
- `errMsg`：错误消息（"ok" 表示成功，错误时为错误描述）
- `data`：单个数据对象（用于返回单个项目的端点）
- `dataSet`：数据对象数组（用于返回多个项目的端点）

## 错误处理

发生错误时，API返回适当的HTTP状态码和错误响应，其中 `errCode` 非0，`errMsg` 为描述性错误信息。

**错误响应示例：**
```json
{
  "errCode": 404,
  "errMsg": "Slave not found"
}
```

## HTTP状态码

- `200 OK`：请求成功
- `400 Bad Request`：无效的请求格式或参数
- `404 Not Found`：资源未找到（例如，从站ID不存在）
- `500 Internal Server Error`：服务器端错误

## 使用示例

### 获取所有从站
```bash
curl -X GET http://localhost:4000/api/slaves
```

### 获取从站详情
```bash
curl -X GET http://localhost:4000/api/slaves/1
```

### 设置保持寄存器
```bash
curl -X POST -H "Content-Type: application/json" -d '{"type":"holdingRegisters","address":0,"value":1234}' http://localhost:4000/api/slaves/1/set-point
```

### 设置线圈
```bash
curl -X POST -H "Content-Type: application/json" -d '{"type":"coils","address":0,"value":1}' http://localhost:4000/api/slaves/1/set-point
```

### 订阅事件
```bash
curl -X GET http://localhost:4000/api/slaves/1/subscribe
```

## 注意事项

- API设计主要用于Web界面内部使用，但也可以被外部应用程序使用
- SSE连接会保持开放，直到客户端断开连接
- API不需要身份验证
- 所有数据点的值都使用整数表示（0或1表示布尔值）
- set-point端点支持所有四种数据点类型：coils、discreteInputs、inputRegisters和holdingRegisters
