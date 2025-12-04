import { RtuApplicationLayer, ModbusMaster, TcpClientPhysicalLayer, TcpApplicationLayer } from 'njs-modbus';
import net from 'node:net';

const server = net.createServer((socket) => {
  console.log('客户端已连接', socket.remoteAddress, socket.remotePort);

  // 监听客户端发送的数据
  socket.on('data', (data) => {
    console.log(`收到客户端数据: ${data.toHex()}`);

    // 向客户端发送响应
    //socket.write(`服务器已收到: ${data}`);
  });

  // 监听客户端断开连接
  socket.on('end', () => {
    console.log('客户端已断开连接');
  });

  // 处理错误
  socket.on('error', (err) => {
    console.error(`Socket 错误: ${err.message}`);
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('服务器已启动，监听端口 3000');
});
