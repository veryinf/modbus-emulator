import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const tcpAddress = '8.145.40.40:502';
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">在线Modbus模拟器</h1>
        <p className="text-xl text-gray-600 mb-8">强大且易用的Modbus从站设备模拟工具，支持TCP和RTU over TCP协议</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">快速开始</h2>
          <p className="text-gray-600 mb-4">
            连接地址：<span className="font-mono bg-gray-100 px-2 py-1 rounded">{tcpAddress}</span>
          </p>
          <p className="text-gray-600 mb-4">选择设备列表中的任意设备进行访问和测试。</p>
          <Link to="/devices/$deviceId" params={{ deviceId: '1' }} className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            查看设备
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">功能特性</h2>
          <ul className="text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>支持Modbus TCP和RTU over TCP协议</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>实时监控和修改寄存器数据</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>支持多种数据格式显示（二进制、十进制、十六进制）</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Web界面直观操作</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">使用说明</h2>
        <div className="text-gray-600 space-y-2">
          <p>
            1. 使用Modbus主站软件连接到地址 <span className="font-mono">{tcpAddress}</span>
          </p>
          <p>2. 选择合适的从站ID（设备ID）</p>
          <p>3. 通过协议读写数据或使用本界面直接查看和修改</p>
          <p>4. 所有更改将实时同步显示</p>
        </div>
      </div>
    </div>
  );
}
