import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">关于 Modbus 设备模拟器</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">简介</h2>
        <p className="mb-4">
          Modbus 设备模拟器是一个用于模拟 Modbus 从站设备的工具，可以帮助开发者在没有实际硬件设备的情况下进行 Modbus 通信测试和调试。
          该模拟器支持多种 Modbus 协议格式，可以模拟各种类型的寄存器和线圈状态。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">连接方式</h2>
        <p className="mb-4">
          要通过 Modbus 协议连接到模拟设备，请按照以下步骤操作：
        </p>
        
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>
            <strong>确定设备地址：</strong>
            在设备列表中选择一个设备，每个设备都有唯一的从站 ID（Slave ID）。
          </li>
          <li>
            <strong>选择通信协议：</strong>
            模拟器支持以下 Modbus 协议：
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Modbus TCP</li>
              <li>Modbus RTU over TCP</li>
            </ul>
          </li>
          <li>
            <strong>配置连接参数：</strong>
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>主机地址：运行模拟器的服务器 IP 地址</li>
              <li>端口号：默认为 502（Modbus 标准端口）</li>
              <li>从站 ID：在设备列表中查看或设置的设备 ID</li>
              <li>超时设置：建议设置为 3-5 秒</li>
            </ul>
          </li>
          <li>
            <strong>建立连接：</strong>
            使用您的 Modbus 主站软件或代码库连接到模拟器。
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">支持的数据类型</h2>
        <p className="mb-4">
          模拟器支持标准 Modbus 协议中的四种数据类型：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">线圈 (Coils)</h3>
            <p>可读可写的单比特值，地址范围: 00001-09999</p>
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">离散输入 (Discrete Inputs)</h3>
            <p>只读的单比特值，地址范围: 10001-19999</p>
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">保持寄存器 (Holding Registers)</h3>
            <p>可读可写的16位字，地址范围: 40001-49999</p>
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">输入寄存器 (Input Registers)</h3>
            <p>只读的16位字，地址范围: 30001-39999</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">功能码支持</h2>
        <p className="mb-4">
          模拟器支持以下标准 Modbus 功能码：
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>01 (0x01) - 读取线圈状态</li>
          <li>02 (0x02) - 读取离散输入状态</li>
          <li>03 (0x03) - 读取保持寄存器</li>
          <li>04 (0x04) - 读取输入寄存器</li>
          <li>05 (0x05) - 写入单个线圈</li>
          <li>06 (0x06) - 写入单个保持寄存器</li>
          <li>15 (0x0F) - 写入多个线圈</li>
          <li>16 (0x10) - 写入多个保持寄存器</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">使用示例</h2>
        <p className="mb-4">
          您可以通过 Web 界面直接查看和修改设备数据点，也可以通过 Modbus 协议从外部客户端访问这些数据。
          所有通过协议进行的更改都会实时反映在 Web 界面上。
        </p>
      </section>
    </div>
  );
}