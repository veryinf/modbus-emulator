import type { BunRequest } from 'bun';
import type { SlaveManager } from '../slave-manager';
import * as slavesHandlers from './handlers/slaves';

export function createRoutes(slaveManager: SlaveManager) {
  return {
    '/api/slaves': {
      GET: () => slavesHandlers.handleGetSlaves(slaveManager),
    },
    '/api/slaves/:slaveId': {
      GET: (request: BunRequest) => slavesHandlers.handleGetSlave(request, slaveManager),
    },
    '/api/slaves/:slaveId/set-point': {
      POST: (request: BunRequest) => slavesHandlers.handleSetPoint(request, slaveManager),
    },
    '/api/slaves/:slaveId/subscribe': {
      GET: (request: BunRequest) => slavesHandlers.handleSubscribe(request, slaveManager),
    },
    '/*': () => Response.json({ errCode: 404, errMsg: 'Not Found' }),
  };
}
