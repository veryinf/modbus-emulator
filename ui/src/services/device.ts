export const API_BASE_URL = '/api';

export type Device = {
  slaveId: number;
  title: string;
  protocol: string;
  points: {
    coils: Point[];
    discreteInputs: Point[];
    holdingRegisters: Point[];
    inputRegisters: Point[];
  };
};

export interface Point {
  address: number;
  value: boolean | number;
}

export const DeviceProtocolLabels: Record<string, string> = {
  'modbus-tcp': 'Modbus TCP',
  'modbus-rtuOverTcp': 'Modbus RTU over TCP',
};

export async function searchDevices(): Promise<API.DataSet<Device>> {
  const response = await fetch(`${API_BASE_URL}/slaves`);
  return response.json();
}

export async function fetchDevice(deviceId: number): Promise<API.Data<Device>> {
  const response = await fetch(`${API_BASE_URL}/slaves/${deviceId}`);
  return await response.json();
}

export type PointType = 'coils' | 'discreteInputs' | 'holdingRegisters' | 'inputRegisters';
export const DevicePointTypeLabels: Record<PointType, string> = {
  coils: '线圈',
  discreteInputs: '离散输入',
  holdingRegisters: '保持寄存器',
  inputRegisters: '输入寄存器',
};
export async function setDevicePoint(slaveId: number, type: PointType, address: number, value: boolean | number | string): Promise<API.ResponseStruct> {
  const response = await fetch(`${API_BASE_URL}/slaves/${slaveId}/set-point`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, address, value }),
  });

  return response.json();
}
