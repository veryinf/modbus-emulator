import { ModbusSlave, RtuApplicationLayer, TcpClientPhysicalLayer, TcpServerPhysicalLayer, type ModbusSlaveModel } from 'njs-modbus';

const initPoints = {
  coils: [
    //
    { address: 0, value: false },
  ],
  discreteInputs: [
    //
    { address: 0, value: false },
  ],
  holdingRegisters: [
    //
    { address: 0, value: 0x00fc },
  ],
  inputRegisters: [
    //
    { address: 0, value: 0x0000 },
  ],
};

const connectionLayer = new TcpServerPhysicalLayer({ port: 502 });
const applicationLayer = new RtuApplicationLayer(connectionLayer);

async function startSlave(slaveId: number) {
  const POINTS = {
    coils: new Map<number, boolean>(),
    discreteInputs: new Map<number, boolean>(),
    holdingRegisters: new Map<number, number>(),
    inputRegisters: new Map<number, number>(),
  };
  initPoints.coils.forEach(({ address, value }) => {
    POINTS.coils.set(address, value);
  });
  initPoints.discreteInputs.forEach(({ address, value }) => {
    POINTS.discreteInputs.set(address, value);
  });
  initPoints.holdingRegisters.forEach(({ address, value }) => {
    POINTS.holdingRegisters.set(address, value);
  });
  initPoints.inputRegisters.forEach(({ address, value }) => {
    POINTS.inputRegisters.set(address, value);
  });

  const handler: ModbusSlaveModel = {
    readCoils: async (address, length) => {
      return Array.from({ length }).map((_, i) => {
        const coil = POINTS.coils.get(address + i);
        if (typeof coil === 'undefined') {
          return false;
        }
        return coil;
      });
    },
    readDiscreteInputs: async (address, length) => {
      return Array.from({ length }).map((_, i) => {
        const discreteInput = POINTS.discreteInputs.get(address + i);
        if (typeof discreteInput === 'undefined') {
          return false;
        }
        return discreteInput;
      });
    },
    readHoldingRegisters: async (address, length) => {
      return Array.from({ length }).map((_, i) => {
        const holdingRegister = POINTS.holdingRegisters.get(address + i);
        if (typeof holdingRegister === 'undefined') {
          return 0;
        }
        return holdingRegister;
      });
    },
    readInputRegisters: async (address, length) => {
      return Array.from({ length }).map((_, i) => {
        const inputRegister = POINTS.inputRegisters.get(address + i);
        if (typeof inputRegister === 'undefined') {
          return 0;
        }
        return inputRegister;
      });
    },

    writeSingleCoil: (address, value) => {
      POINTS.coils.set(address, value);
    },

    writeSingleRegister: (address, value) => {
      POINTS.holdingRegisters.set(address, value);
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

  const slave = new ModbusSlave(handler, applicationLayer, connectionLayer);
  slave.unit = slaveId;
  try {
    await slave.open();
    console.log('opened slaveId ' + slaveId);
  } catch (error) {
    console.log(error);
  }
}

startSlave(1);
