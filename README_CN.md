# Modbus从站模拟器

一个基于Go语言开发的高性能Modbus从站设备模拟器，支持Modbus TCP和Modbus RTU over TCP两种协议，提供现代化的Web界面，可直接通过浏览器访问和管理。

[![Go Report Card](https://goreportcard.com/badge/github.com/veryinf/modbus-emulator)](https://goreportcard.com/report/github.com/veryinf/modbus-emulator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 目录

- [简介](#简介)
- [核心功能](#核心功能)
- [应用场景](#应用场景)
- [系统要求](#系统要求)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [Web界面使用指南](#web界面使用指南)
- [技术优势](#技术优势)
- [许可证](#许可证)
- [支持与反馈](#支持与反馈)

## 简介

Modbus从站模拟器是一款功能强大、易于使用的Web应用程序，用于模拟Modbus从站设备。它允许您快速创建、配置和管理多个具有预定义寄存器值的Modbus从站设备，所有操作均可通过现代化的Web界面完成。无论您是开发Modbus主站应用、测试工业控制系统，还是学习Modbus协议，这款模拟器都能提供便捷灵活的解决方案。

## 核心功能

- **双协议支持**：同时支持Modbus TCP和Modbus RTU over TCP协议
- **多设备管理**：可在同一端口上运行和管理多个Modbus从站设备，通过slaveId区分
- **预定义寄存器值**：可配置线圈、离散输入、输入寄存器和保持寄存器的初始值
- **实时事件订阅**：寄存器值变化时立即通知
- **Web界面**：通过任何现代Web浏览器访问和控制模拟器
- **高性能**：基于Go语言开发，性能优秀，资源占用低
- **简单配置**：通过JSON配置文件轻松设置设备
- **无需数据库**：基于内存存储，无外部依赖
- **跨平台**：支持Windows、Linux和macOS
- **RESTful API**：提供完整的RESTful API，支持编程方式访问所有模拟器功能

## 应用场景

### 1. Modbus主站应用开发

开发Modbus主站应用时，需要可靠的从站设备进行测试。Modbus从站模拟器提供了便捷的方式来创建和配置多个带有预定义寄存器值的从站设备，让您能够全面测试主站应用的功能。

### 2. 工业控制系统测试

在部署基于Modbus的工业控制系统之前，在受控环境中进行测试至关重要。模拟器允许您通过配置不同的寄存器值来模拟各种场景，并监控控制系统的响应。

### 3. Modbus协议学习

如果您正在学习Modbus协议，模拟器提供了一个安全、简单的方式来实验Modbus通信。您可以创建从站设备，设置寄存器值，并使用Modbus主站工具读写这些值，帮助您理解协议的工作原理。

### 4. 系统集成测试

将多个Modbus设备集成到更大的系统时，您可以使用模拟器来模拟尚未可用的设备，从而在开发过程早期测试集成情况。

### 5. 培训与演示

模拟器是培训课程和演示的绝佳工具。它提供了直观的方式来展示Modbus通信的工作原理，使学员更容易理解协议。

## 系统要求

- **操作系统**：Windows 10+、Linux、macOS
- **Go语言**：1.25或更高版本（仅用于从源码构建）
- **Web浏览器**：Chrome、Firefox、Safari、Edge（最新版本）
- **网络**：可访问Modbus主设备所在的网络

## 快速开始

### 推荐：从Release下载

最简单的开始方式是从[Release](https://github.com/veryinf/modbus-emulator/releases)页面下载预构建的二进制文件：

1. 访问[Release](https://github.com/veryinf/modbus-emulator/releases)页面
2. 下载适合您操作系统的二进制文件
3. 运行二进制文件
4. 打开Web浏览器，导航至 http://localhost:8080

### 备选：从源码运行

如果您喜欢从源码运行，请按照以下步骤操作：

#### 1. 下载或克隆仓库

```bash
git clone https://github.com/veryinf/modbus-emulator.git
cd modbus-emulator
```

#### 2. 运行应用程序

##### 方式一：构建并运行

```bash
# 构建应用程序
go build -o modbus-slave-simulator ./cmd/main.go

# 运行应用程序
./modbus-slave-simulator
```

##### 方式二：直接使用Go运行

```
go run ./cmd/main.go
```

#### 3. 访问Web界面

打开您的Web浏览器，导航至：
```
http://localhost:4000
```

您将看到Modbus从站模拟器的主界面，即可开始使用模拟器。

## 配置说明

### 设备配置

模拟器使用JSON配置文件（`devices-config.json`）来定义从站设备。以下是一个配置示例：

```json
{
  "devices": [
    {
      "slaveId": 1,
      "protocol": "tcp",
      "title": "PLC模拟器",
      "description": "主PLC模拟器",
      "points": {
        "coils": {
          "0": true,
          "1": false,
          "2": true
        },
        "holdingRegisters": {
          "0": 1234,
          "1": 5678,
          "2": 9012
        }
      }
    },
    {
      "slaveId": 2,
      "protocol": "rtu-over-tcp",
      "title": "RTU设备",
      "description": "RTU over TCP设备",
      "points": {
        "discreteInputs": {
          "0": true,
          "1": false
        },
        "inputRegisters": {
          "0": 3333,
          "1": 4444
        }
      }
    }
  ]
}
```

### 配置选项说明

- **slaveId**：Modbus从站ID（1-247）- 用于在同一端口上区分不同的设备
- **protocol**：协议类型，可选值为"tcp"或"rtu-over-tcp"
- **title**：设备的可读名称
- **description**：设备的可选描述
- **points**：寄存器的预定义值：
  - **coils**：线圈值（true/false）
  - **discreteInputs**：离散输入值（true/false）
  - **inputRegisters**：输入寄存器值（16位整数）
  - **holdingRegisters**：保持寄存器值（16位整数）

## Web界面使用指南

### 主仪表板

主仪表板显示所有已配置的从站设备，包括它们的状态、协议和从站ID。从这里您可以：

- 查看所有从站设备
- 访问设备详情
- 订阅实时事件

### 设备详情

点击仪表板中的设备，进入设备详情页面，您可以：
- 查看设备信息
- 查看所有类型的寄存器值（线圈、离散输入、输入寄存器、保持寄存器）
- 设置寄存器值
- 监控寄存器变化

### 设置寄存器值

设置寄存器值的步骤：
1. 从仪表板中选择设备
2. 输入寄存器类型（线圈、离散输入、输入寄存器或保持寄存器）
3. 输入寄存器地址
4. 输入新值
5. 点击"Set Point"按钮

### 实时事件订阅

模拟器支持实时事件订阅，当寄存器值变化时会通知您。订阅事件的步骤：
1. 从仪表板中选择设备
2. 点击"Subscribe to Events"按钮
3. 您将开始接收寄存器值变化的实时通知

## 技术优势

### 高性能

基于Go语言开发，模拟器提供卓越的性能和低资源占用，允许您同时运行多个设备而不会对系统资源造成显著影响。

### 现代架构

模拟器采用现代架构，清晰分离了Modbus协议处理和Web界面，便于维护和扩展。

### 可靠稳定

模拟器设计可靠稳定，具有适当的错误处理和恢复机制。

### 易于部署

无外部依赖，只需安装Go即可轻松部署和运行，适合各种环境。

## 许可证

本项目采用[MIT许可证](LICENSE) - 详见LICENSE文件。

## 支持与反馈

如有问题、疑问或建议，请在GitHub上提交[issue](https://github.com/veryinf/modbus-emulator/issues)。

## 语言支持

- [English](README.md) - 英文文档
- [中文](README_CN.md) (本文件) - 中文文档
