// 从站数据点类型定义
export interface SlavePoints {
  coils: Map<number, boolean>;
  discreteInputs: Map<number, boolean>;
  holdingRegisters: Map<number, number>;
  inputRegisters: Map<number, number>;
}

// 从站实例信息
export interface SlaveInstance {
  slaveId: number;
  slave: any; // ModbusSlave
  points: SlavePoints;
  config: SlaveConfig;
}

// 初始化数据点类型
export interface InitPoints {
  coils?: Array<{ address: number; value: boolean }>;
  discreteInputs?: Array<{ address: number; value: boolean }>;
  holdingRegisters?: Array<{ address: number; value: number }>;
  inputRegisters?: Array<{ address: number; value: number }>;
}

// 协议类型枚举
export enum ProtocolType {
  MODBUS_RTUOVERTCP = 'modbus-rtuOverTcp',
  MODBUS_TCP = 'modbus-tcp',
}

// 从站配置
export interface SlaveConfig {
  slaveId: number; // 必填从站ID
  title?: string; // 从站标题/别名
  protocol: ProtocolType;
}
