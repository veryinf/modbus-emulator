# Modbus Slave Simulator

A high-performance, web-based Modbus slave device simulator that allows you to create and manage multiple Modbus slave devices simultaneously, supporting both Modbus TCP and Modbus RTU over TCP protocols. Similar to Modbus Slave, but with a modern web interface and enhanced features.

[![Go Report Card](https://goreportcard.com/badge/github.com/veryinf/emulator-go)](https://goreportcard.com/report/github.com/veryinf/emulator-go)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Use Cases](#use-cases)
- [System Requirements](#system-requirements)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Web Interface Usage](#web-interface-usage)
- [Technical Advantages](#technical-advantages)
- [License](#license)
- [Support](#support)

## Introduction

Modbus Slave Simulator is a powerful, easy-to-use web-based application that simulates Modbus slave devices. It allows you to quickly create, configure, and manage multiple Modbus slave devices with predefined register values, all accessible through a modern web interface. Whether you're developing Modbus master applications, testing industrial control systems, or learning Modbus protocol, this simulator provides a convenient and flexible solution.

## Key Features

- **Dual Protocol Support**: Simultaneously support Modbus TCP and Modbus RTU over TCP protocols
- **Multiple Device Management**: Run and manage multiple Modbus slave devices on the same port, differentiated by slaveId
- **Predefined Register Values**: Configure initial values for coils, discrete inputs, input registers, and holding registers
- **Real-time Event Subscription**: Get instant notifications when register values change
- **Web-based Interface**: Access and control the simulator from any modern web browser
- **High Performance**: Built with Go for excellent performance and low resource usage
- **Easy Configuration**: Simple JSON configuration file for device setup
- **No Database Required**: In-memory data storage, no external dependencies
- **Cross-platform**: Runs on Windows, Linux, and macOS
- **RESTful API**: Full RESTful API for programmatic access to all simulator functions

## Use Cases

### 1. Modbus Master Application Development

When developing Modbus master applications, you need reliable slave devices to test against. Modbus Slave Simulator provides a convenient way to create and configure multiple slave devices with predefined register values, allowing you to thoroughly test your master application's functionality.

### 2. Industrial Control System Testing

Before deploying Modbus-based industrial control systems, it's essential to test them in a controlled environment. The simulator allows you to simulate various scenarios by configuring different register values and monitoring how your control system responds.

### 3. Modbus Protocol Learning

If you're learning Modbus protocol, the simulator provides a safe and easy way to experiment with Modbus communication. You can create slave devices, set register values, and use Modbus master tools to read and write to them, helping you understand how the protocol works.

### 4. System Integration Testing

When integrating multiple Modbus devices into a larger system, you can use the simulator to mock devices that are not yet available, allowing you to test the integration early in the development process.

### 5. Training and Demonstrations

The simulator is an excellent tool for training sessions and demonstrations. It provides a visual way to show how Modbus communication works, making it easier for trainees to understand the protocol.

## System Requirements

- **Operating System**: Windows 10+, Linux, macOS
- **Go**: 1.25 or higher (for building from source)
- **Web Browser**: Chrome, Firefox, Safari, Edge (latest versions)
- **Network**: Access to the network where Modbus master devices are located

## Quick Start

### Recommended: Download from Release

The easiest way to get started is to download the pre-built binary from the [Release](https://github.com/veryinf/emulator-go/releases) page:

1. Go to the [Release](https://github.com/veryinf/emulator-go/releases) page
2. Download the appropriate binary for your operating system
3. Run the binary file
4. Open your web browser and navigate to http://localhost:8080

### Alternative: Run from Source

If you prefer to run from source, follow these steps:

#### 1. Download or Clone the Repository

```bash
git clone https://github.com/veryinf/emulator-go.git
cd emulator-go
```

#### 2. Run the Application

##### Option 1: Build and Run

```bash
# Build the application
go build -o modbus-slave-simulator ./cmd/main.go

# Run the application with default settings
./modbus-slave-simulator

# Run the application with custom settings
./modbus-slave-simulator --http-addr :9000 --modbus-addr :5020 --config custom-config.json
```

##### Option 2: Run Directly with Go

```bash
# Run with default settings
go run ./cmd/main.go

# Run with custom settings
go run ./cmd/main.go --http-addr :9000 --modbus-addr :5020 --config custom-config.json
```

#### 3. Access the Web Interface

Open your web browser and navigate to the HTTP address you specified (default: `http://localhost:4000`).

You will see the main interface of the Modbus Slave Simulator, where you can start using the simulator immediately.

## Command Line Options

The simulator supports the following command line options:

| Option | Default | Description |
|--------|---------|-------------|
| `--http-addr` | `:4000` | Specify the HTTP server address |
| `--modbus-addr` | `:502` | Specify the Modbus TCP server address |
| `--config` | `devices-config.json` | Specify the device configuration file path |
| `--help`, `-h` | - | Show help information |
| `--version`, `-v` | - | Print the version information |

### Examples

```bash
# Run with custom HTTP port
./modbus-slave-simulator --http-addr :9000

# Run with custom Modbus TCP port
./modbus-slave-simulator --modbus-addr :5020

# Run with custom configuration file
./modbus-slave-simulator --config my-devices.json

# Run with all custom settings
./modbus-slave-simulator --http-addr :9000 --modbus-addr :5020 --config my-devices.json
```

## Configuration

### Device Configuration

The simulator uses a JSON configuration file (`devices-config.json`) to define slave devices. Here's an example configuration:

```json
{
  "devices": [
    {
      "slaveId": 1,
      "protocol": "tcp",
      "title": "PLC Simulator",
      "description": "Main PLC simulator",
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
      "title": "RTU Device",
      "description": "RTU over TCP device",
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

### Configuration Options

- **slaveId**: Modbus slave ID (1-247) - Used to differentiate devices on the same port
- **protocol**: Protocol type ("tcp" or "rtu-over-tcp")
- **title**: Human-readable name of the device
- **description**: Optional description of the device
- **points**: Predefined values for registers:
  - **coils**: Coil values (true/false)
  - **discreteInputs**: Discrete input values (true/false)
  - **inputRegisters**: Input register values (16-bit integers)
  - **holdingRegisters**: Holding register values (16-bit integers)

## Web Interface Usage

### Main Dashboard

The main dashboard displays all configured slave devices, including their status, protocol, port, and slave ID. From here, you can:

- View all slave devices
- Access device details
- Subscribe to real-time events

### Device Details

Clicking on a device in the dashboard takes you to the device details page, where you can:
- View device information
- Set register values
- Monitor register changes

### Setting Register Values

To set a register value:
1. Select the device from the dashboard
2. Enter the register type (coil or holding register)
3. Enter the register address
4. Enter the new value
5. Click "Set Point"

### Real-time Event Subscription

The simulator supports real-time event subscription, which notifies you when register values change. To subscribe to events:
1. Select the device from the dashboard
2. Click "Subscribe to Events"
3. You will start receiving real-time notifications whenever register values change

## Technical Advantages

### High Performance

Built with Go, the simulator offers excellent performance and low resource usage, allowing you to run multiple devices simultaneously without significant impact on system resources.

### Modern Architecture

The simulator uses a modern architecture with a clear separation between the Modbus protocol handling and the web interface, making it easy to maintain and extend.

### Reliable and Stable

The simulator is designed to be reliable and stable, with proper error handling and recovery mechanisms.

### Easy to Deploy

With no external dependencies, the simulator is easy to deploy and run on any system with Go installed.

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an [issue](https://github.com/veryinf/emulator-go/issues) on GitHub.

## Language Support

- [English](README.md) (this file)
- [中文](README_CN.md) - Chinese documentation
