import { createRoutes } from './api/router';
import { SlaveManager } from './slave-manager';
import { ProtocolType } from './types';
import { validateConfig } from './config-validator';
import { u } from '../ui/dist/assets/index-BbN0Rzme';

// 创建从站管理器实例
const slaveManager = new SlaveManager(502);

// 初始化默认从站
async function startSlaves() {
  try {
    // 从配置文件读取从站配置
    const configText = await Bun.file('slaves-config.json').text();
    const parsedConfig = JSON.parse(configText);

    // 使用 Zod 验证配置
    const slavesConfig = validateConfig(parsedConfig);

    // 根据配置创建从站
    for (const slaveConfig of slavesConfig) {
      await slaveManager.createSlave(
        {
          slaveId: slaveConfig.slaveId,
          title: slaveConfig.title,
          protocol: slaveConfig.protocol as ProtocolType,
        },
        slaveConfig.points as any,
      );
    }
  } catch (error) {
    console.error('初始化默认从站失败:', error);
    process.exit(1);
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
    //development: false,
  });

  console.log(`\n🚀 Modbus 模拟器已启动`);
  console.log(`🌐 HTTP API 服务器: http://localhost:${HTTP_PORT}`);
  console.log(`\n📚 API 文档:`);
  console.log(`   GET  /api/slaves           - 获取所有从站数据`);
  console.log(`   GET  /api/slaves/:slaveId  - 获取指定从站数据`);
  console.log(`   POST /api/data-points      - 设置单个数据点`);
  console.log(``);
}

start();
