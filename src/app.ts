import { createRoutes } from './api/router';
import { SlaveManager } from './slave-manager';
import { ProtocolType } from './types';

// 创建从站管理器实例
const slaveManager = new SlaveManager(502);

// 初始化默认从站
async function startSlaves() {
  try {
    // 创建一个 RTU over TCP 协议的从站
    await slaveManager.createSlave(
      {
        slaveId: 1,
        title: '默认从站',
        protocol: ProtocolType.MODBUS_RTUOVERTCP,
      },
      {
        coils: [{ address: 0, value: false }],
        discreteInputs: [{ address: 0, value: false }],
        holdingRegisters: [{ address: 0, value: 0x00fc }],
        inputRegisters: [{ address: 0, value: 0x0000 }],
      },
    );

    // 创建一个 Modbus TCP 协议的从站
    await slaveManager.createSlave(
      {
        slaveId: 2,
        title: '默认从站2',
        protocol: ProtocolType.MODBUS_TCP,
      },
      {
        coils: [{ address: 0, value: false }],
        discreteInputs: [{ address: 0, value: false }],
        holdingRegisters: [{ address: 0, value: 0x00ff }],
        inputRegisters: [{ address: 0, value: 0x0000 }],
      },
    );
  } catch (error) {
    console.error('初始化默认从站失败:', error);
  }
}

// 启动服务器
const HTTP_PORT = 4000;

async function start() {
  // 初始化默认从站
  await startSlaves();

  // 使用 Bun.serve 启动 HTTP API 服务器
  Bun.serve({
    idleTimeout: 0,
    port: HTTP_PORT,
    routes: createRoutes(slaveManager),
  });

  console.log(`\n🚀 Modbus 模拟器已启动`);
  console.log(`🌐 HTTP API 服务器: http://localhost:${HTTP_PORT}`);
  console.log(`\n📚 API 文档:`);
  console.log(`   GET  /api/slaves             - 获取所有从站数据`);
  console.log(`   GET  /api/slaves/:slaveId  - 获取指定从站数据`);
  console.log(`   POST /api/data-points      - 设置单个数据点`);
  console.log(``);
}

start();
