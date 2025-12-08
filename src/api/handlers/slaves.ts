import type { BunRequest } from 'bun';
import type { SlaveManager } from '../../slave-manager';
import type { SlavePoints } from '../../types';
import z from 'zod';
import { PointChangeEvent } from '../../slave-manager';
import { server } from 'typescript';

export async function handleGetSlaves(slaveManager: SlaveManager): Promise<Response> {
  const slaveIds = slaveManager.getAllSlaveIds();

  const allSlavesData = slaveIds
    .map((slaveId) => {
      const instance = slaveManager.getSlave(slaveId);
      if (!instance) return null;

      return {
        slaveId,
        title: instance.config.title || `Slave ${slaveId}`,
        protocol: instance.config.protocol,
      };
    })
    .filter(Boolean);

  return Response.json({ errCode: 0, errMsg: 'ok', dataSet: allSlavesData });
}

export async function handleGetSlave(request: BunRequest<'/api/slaves/:slaveId'>, slaveManager: SlaveManager): Promise<Response> {
  const slaveId = parseInt(request.params.slaveId, 10);
  const instance = slaveManager.getSlave(slaveId);

  if (!instance) {
    return Response.json({ errCode: 404, errMsg: 'Slave not found' });
  }

  const points = instance.points;
  return Response.json({
    errCode: 0,
    errMsg: 'ok',
    data: {
      slaveId,
      title: instance.config.title || `Slave ${slaveId}`,
      protocol: instance.config.protocol,
      points: {
        coils: Array.from(points.coils.entries()).map(([address, value]) => ({ address, value })),
        discreteInputs: Array.from(points.discreteInputs.entries()).map(([address, value]) => ({ address, value })),
        holdingRegisters: Array.from(points.holdingRegisters.entries()).map(([address, value]) => ({ address, value })),
        inputRegisters: Array.from(points.inputRegisters.entries()).map(([address, value]) => ({ address, value })),
      },
    },
  });
}

// 统一设置数据点的接口
export async function handleSetPoint(request: BunRequest<'/api/slaves/:slaveId/set-point'>, slaveManager: SlaveManager): Promise<Response> {
  const slaveId = parseInt(request.params.slaveId, 10);
  const instance = slaveManager.getSlave(slaveId);
  if (!instance) {
    return Response.json({ errCode: 404, errMsg: 'Slave not found' });
  }

  const inputSchema = z.object({
    type: z.enum(['coils', 'discreteInputs', 'holdingRegisters', 'inputRegisters']),
    address: z.number().int().gte(0),
    value: z.union([z.boolean(), z.number(), z.string().startsWith('0x').length(6)]), // 对于寄存器，可以是数字或十六进制字符串
  });
  const jsonData = await request.json();
  const { success, data: input, error: validateError } = inputSchema.safeParse(jsonData);
  if (!success) {
    const messages = validateError.issues.map((v) => v.message);
    return Response.json({ errCode: 400, errMsg: 'Invalid input', subMessages: messages });
  }

  switch (input.type) {
    case 'coils':
    case 'discreteInputs':
      // 线圈值应为布尔值或 0/1 数字
      const boolValue = typeof input.value === 'string' ? input.value === '1' : Boolean(input.value);
      slaveManager.setPointValue(slaveId, input.type, input.address, boolValue);
      break;
    case 'inputRegisters':
    case 'holdingRegisters':
      // 保持寄存器值可以是数字或十六进制字符串
      const registerValue = typeof input.value === 'string' ? parseInt(input.value, 16) : Number(input.value);
      if (registerValue < 0 || registerValue > 65535) {
        return Response.json({ errCode: 400, errMsg: 'Invalid register value' });
      }
      slaveManager.setPointValue(slaveId, input.type, input.address, registerValue);
      break;
  }
  return Response.json({ errCode: 0, errMsg: 'ok' });
}

// 处理SSE订阅请求
export function handleSubscribe(request: BunRequest<'/api/slaves/:slaveId/subscribe'>, slaveManager: SlaveManager): Response {
  const slaveId = parseInt(request.params.slaveId, 10);
  const instance = slaveManager.getSlave(slaveId);

  if (!instance) {
    return Response.json({ errCode: 404, errMsg: 'Slave not found' });
  }

  // 设置SSE响应头
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  };

  // 创建ReadableStream用于发送事件
  const stream = new ReadableStream({
    start(controller) {
      // 发送初始连接消息
      controller.enqueue(`data: ${JSON.stringify({ type: 'connected', message: 'Subscribed to slave updates' })}\n\n`);

      // 监听点位变更事件
      const pointChangeListener = (event: PointChangeEvent) => {
        // 只发送对应slaveId的事件
        if (event.slaveId === slaveId) {
          controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
        }
      };

      // 添加事件监听器
      slaveManager.on('pointChange', pointChangeListener);

      // 当客户端断开连接时清理监听器
      request.signal.addEventListener('abort', () => {
        slaveManager.off('pointChange', pointChangeListener);
        controller.close();
      });
    },
  });

  return new Response(stream, { headers });
}
