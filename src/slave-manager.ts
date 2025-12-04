import { ModbusSlave, RtuApplicationLayer, TcpApplicationLayer, TcpServerPhysicalLayer, type ModbusSlaveModel } from 'njs-modbus';
import { type SlavePoints, type SlaveInstance, type InitPoints, ProtocolType, type SlaveConfig } from './types';
import { EventEmitter } from 'events';

// 定义点位变更事件的数据结构
export interface PointChangeEvent {
  slaveId: number;
  type: 'coils' | 'discreteInputs' | 'holdingRegisters' | 'inputRegisters';
  address: number;
  value: boolean | number;
}

// 从站管理器
export class SlaveManager extends EventEmitter {
  private slaves: Map<number, SlaveInstance> = new Map();
  private port;
  private connectionLayer;
  private tcpApplicationLayer;
  private rtuApplicationLayer;

  constructor(port: number) {
    super();
    this.port = port;
    // 无参构造函数
    this.connectionLayer = new TcpServerPhysicalLayer({ port });
    this.tcpApplicationLayer = new TcpApplicationLayer(this.connectionLayer);
    this.rtuApplicationLayer = new RtuApplicationLayer(this.connectionLayer);
  }

  // 创建新从站
  async createSlave(config: SlaveConfig, initPoints?: InitPoints): Promise<number> {
    const id = config.slaveId;
    const protocol = config.protocol;

    if (this.slaves.has(id)) {
      throw new Error(`从站 ID ${id} 已存在`);
    }

    const points: SlavePoints = {
      coils: new Map<number, boolean>(),
      discreteInputs: new Map<number, boolean>(),
      holdingRegisters: new Map<number, number>(),
      inputRegisters: new Map<number, number>(),
    };

    // 初始化数据点
    if (initPoints) {
      initPoints.coils?.forEach(({ address, value }) => {
        points.coils.set(address, value);
      });
      initPoints.discreteInputs?.forEach(({ address, value }) => {
        points.discreteInputs.set(address, value);
      });
      initPoints.holdingRegisters?.forEach(({ address, value }) => {
        points.holdingRegisters.set(address, value);
      });
      initPoints.inputRegisters?.forEach(({ address, value }) => {
        points.inputRegisters.set(address, value);
      });
    }

    const handler: ModbusSlaveModel = {
      readCoils: (address, length) => {
        return Array.from({ length }).map((_, i) => {
          const coil = points.coils.get(address + i);
          return typeof coil === 'undefined' ? false : coil;
        });
      },
      readDiscreteInputs: (address, length) => {
        return Array.from({ length }).map((_, i) => {
          const discreteInput = points.discreteInputs.get(address + i);
          return typeof discreteInput === 'undefined' ? false : discreteInput;
        });
      },
      readHoldingRegisters: (address, length) => {
        return Array.from({ length }).map((_, i) => {
          const holdingRegister = points.holdingRegisters.get(address + i);
          return typeof holdingRegister === 'undefined' ? 0 : holdingRegister;
        });
      },
      readInputRegisters: (address, length) => {
        return Array.from({ length }).map((_, i) => {
          const inputRegister = points.inputRegisters.get(address + i);
          return typeof inputRegister === 'undefined' ? 0 : inputRegister;
        });
      },
      writeSingleCoil: (address, value) => {
        this.setPointValue(id, 'coils', address, value);
      },
      writeSingleRegister: (address, value) => {
        this.setPointValue(id, 'holdingRegisters', address, value);
      },
      reportServerId: () => ({ additionalData: [1, 2, 3] }),
      readDeviceIdentification: () => ({
        0x00: 'Basic:VendorName',
        0x01: 'Basic:ProductCode',
        0x02: 'Basic:MajorMinorRevision',
        0x03: 'Regular:VendorUrl',
        0x04: 'Regular:ProductName',
        0x05: 'Regular:ModelName',
        0x06: 'Regular:UserApplicationName',
        0x80: 'Extended:Extended',
        0xff: 'Extended:Extended',
      }),
    };

    // 根据协议类型选择相应的应用层
    const slave = new ModbusSlave(handler, protocol === ProtocolType.MODBUS_TCP ? this.tcpApplicationLayer : this.rtuApplicationLayer, this.connectionLayer);
    slave.unit = id;

    try {
      if (!slave.isOpen) {
        await slave.open({ port: this.port });
      }
      this.slaves.set(id, { slaveId: id, config, slave, points });
      console.log(`✓ 从站 ${id} 已启动, 协议: ${protocol}`);
      return id;
    } catch (error) {
      console.error(`✗ 从站 ${id} 启动失败, 协议: ${protocol}`);
      throw error;
    }
  }

  // 删除从站
  async removeSlave(slaveId: number): Promise<boolean> {
    const instance = this.slaves.get(slaveId);
    if (!instance) {
      return false;
    }

    try {
      await instance.slave.close();
      this.slaves.delete(slaveId);
      console.log(`✓ 从站 ${slaveId} 已关闭`);
      return true;
    } catch (error) {
      console.error(`✗ 从站 ${slaveId} 关闭失败:`, error);
      return false;
    }
  }

  // 获取从站实例
  getSlave(slaveId: number): SlaveInstance | undefined {
    return this.slaves.get(slaveId);
  }

  // 获取所有从站ID
  getAllSlaveIds(): number[] {
    return Array.from(this.slaves.keys());
  }

  // 获取从站数据点
  getPoints(slaveId: number): SlavePoints | undefined {
    return this.slaves.get(slaveId)?.points;
  }

  // 手动设置点位值的方法（用于触发事件）
  setPointValue(slaveId: number, type: keyof SlavePoints, address: number, value: boolean | number): void {
    const instance = this.slaves.get(slaveId);
    if (!instance) {
      throw new Error(`从站 ${slaveId} 不存在`);
    }

    const points = instance.points;

    switch (type) {
      case 'coils':
        if (typeof value === 'boolean') {
          points.coils.set(address, value);
          this.emit('pointChange', { slaveId, type, address, value } as PointChangeEvent);
        }
        break;
      case 'discreteInputs':
        if (typeof value === 'boolean') {
          points.discreteInputs.set(address, value);
          this.emit('pointChange', { slaveId, type, address, value } as PointChangeEvent);
        }
        break;
      case 'holdingRegisters':
        if (typeof value === 'number') {
          points.holdingRegisters.set(address, value);
          this.emit('pointChange', { slaveId, type, address, value } as PointChangeEvent);
        }
        break;
      case 'inputRegisters':
        if (typeof value === 'number') {
          points.inputRegisters.set(address, value);
          this.emit('pointChange', { slaveId, type, address, value } as PointChangeEvent);
        }
        break;
    }
  }
}
