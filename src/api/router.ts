import { file, type BunRequest } from 'bun';
import type { SlaveManager } from '../slave-manager';
import * as slavesHandlers from './handlers/slaves';
import fs from 'node:fs';
import path from 'node:path';

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
    '/*': (request: BunRequest) => {
      const assetsDir = './ui/dist';
      const uri = new URL(request.url);
      const filePath = `${assetsDir}${uri.pathname}`;
      //判断是否文件
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return new Response(file(filePath));
      } else {
        return new Response(file(path.join(assetsDir, 'index.html')));
      }
    },
  };
}
