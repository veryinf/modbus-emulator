import { createFileRoute } from '@tanstack/react-router';
import { Info, Globe, Server, Cpu, Bell, Gauge, Code, Github, Download, Activity, Database, Zap, Shield, Terminal, Play } from 'lucide-react';
import { useApplicationInfo } from '../services/app';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    return {
      title: 'Modbus从站模拟器',
    };
  },
});

function Home() {
  const { applicationInfo } = useApplicationInfo();
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="工业自动化背景" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 opacity-90"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-3/5 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                基于Web的
                <br />
                Modbus从站模拟器
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-lg">简单、高效、可靠的Modbus从站设备模拟工具，支持多种协议和设备类型，让开发测试更轻松</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                <a href="#quick-start" className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" /> 立即使用
                </a>
                <a href="https://github.com/veryinf/modbus-emulator/releases" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center">
                  <Download className="w-5 h-5 mr-2" /> 下载
                </a>
                <a href="https://github.com/veryinf/modbus-emulator" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center">
                  <Github className="w-5 h-5 mr-2" /> Star on GitHub
                </a>
              </div>
              <div className="mt-8 flex items-center space-x-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-700">1</div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-700">2</div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-700">3</div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-700">+</div>
                </div>
                <div className="text-sm text-blue-100">
                  已有 <span className="font-bold text-white">1000+</span> 开发者使用
                </div>
              </div>
            </div>

            <div className="lg:w-2/5 w-full space-y-6">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Activity className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-sm text-blue-100">实时数据监控 · SSE支持</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-bold text-white mb-1">极速启动</div>
                  <div className="text-xs text-blue-200">秒级响应</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-bold text-white mb-1">稳定可靠</div>
                  <div className="text-xs text-blue-200">高并发支持</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-bold text-white mb-1">灵活配置</div>
                  <div className="text-xs text-blue-200">JSON配置</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Terminal className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-bold text-white mb-1">实时监控</div>
                  <div className="text-xs text-blue-200">SSE推送</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      <section id="quick-start" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 tech-line inline-block">快速入门</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">只需四步，即可开始使用Modbus从站模拟器</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-4">1</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">选择设备</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">从设备列表中选择合适的Modbus从站设备</p>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-2">示例设备信息：</div>
                <div className="text-xs text-gray-700 space-y-1">
                  <div>• 设备名称：温度传感器</div>
                  <div>• SlaveID：1</div>
                  <div>• 协议：TCP</div>
                  <div>• 端口：502</div>
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-4">2</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">打开主站</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">打开Master（主站）设备或模拟软件</p>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-2">推荐工具：</div>
                <div className="text-xs text-gray-700 space-y-1">
                  <div>• Modbus Poll</div>
                  <div>• QModMaster</div>
                  <div>• Modbus Master Simulator</div>
                  <div>• 自定义主站程序</div>
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-4">3</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">连接设备</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">使用设备的地址和端口直接连接</p>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-2">连接参数：</div>
                <div className="text-xs text-gray-700 space-y-1">
                  <div>• IP地址：{applicationInfo?.host || '127.0.0.1'}</div>
                  <div>• 端口：{applicationInfo?.port || 502}</div>
                  <div>• SlaveID：1</div>
                  <div>• 功能码：根据需要选择</div>
                </div>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-4">4</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">管理数据</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">使用在线页面管理从站设备数据</p>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-2">管理功能：</div>
                <div className="text-xs text-gray-700 space-y-1">
                  <div>• 实时查看设备状态</div>
                  <div>• 修改寄存器数值</div>
                  <div>• 监控数据变化趋势</div>
                  <div>• 导出设备配置</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-4">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-800 mb-2">提示</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 确保模拟器服务已启动，设备处于在线状态</li>
                  <li>• 根据设备支持的寄存器类型选择相应的功能码</li>
                  <li>• 可以在设备详情页面实时查看数据变化，支持多种格式显示</li>
                  <li>• 支持实时数据订阅，数据变化时会自动更新显示</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 bg-gray-50 industrial-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 tech-line inline-block">核心功能</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">强大的Modbus从站模拟功能，满足各种测试和开发需求</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="feature-card bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">多协议支持</h3>
              <p className="text-gray-600 text-sm leading-relaxed">支持Modbus TCP和Modbus RTU over TCP协议，满足不同场景的需求</p>
            </div>
            <div className="feature-card bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">多设备管理</h3>
              <p className="text-gray-600 text-sm leading-relaxed">可在不同端口上运行和管理多个Modbus从站设备</p>
            </div>
            <div className="feature-card bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">全类型寄存器</h3>
              <p className="text-gray-600 text-sm leading-relaxed">支持线圈、离散输入、输入寄存器和保持寄存器的初始值配置</p>
            </div>
            <div className="feature-card bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">实时事件订阅</h3>
              <p className="text-gray-600 text-sm leading-relaxed">寄存器值变化时立即通知，实现实时监控</p>
            </div>
            <div className="feature-card bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Gauge className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">高性能</h3>
              <p className="text-gray-600 text-sm leading-relaxed">基于Go语言开发，性能优秀，资源占用低</p>
            </div>
            <div className="feature-card bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">简单配置</h3>
              <p className="text-gray-600 text-sm leading-relaxed">通过JSON配置文件轻松设置设备，无需复杂的数据库配置</p>
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 tech-line inline-block">应用场景</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">适用于各种Modbus设备测试和开发场景</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">开发测试</h3>
                <p className="text-sm text-gray-600 mb-4">为Modbus主站开发人员提供模拟设备，方便测试和调试代码</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    无需实际硬件设备
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    支持多种异常情况模拟
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    快速配置和部署
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">工业自动化</h3>
                <p className="text-sm text-gray-600 mb-4">在工业自动化系统中模拟各种Modbus设备，进行系统集成测试</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    支持多种工业设备类型
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    可模拟复杂设备行为
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    高可靠性和稳定性
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-md border border-purple-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">教育训练</h3>
                <p className="text-sm text-gray-600 mb-4">用于教学和培训，帮助学生理解Modbus通信原理和协议</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    可视化操作界面
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    实时数据监控
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    低成本学习方案
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-md border border-orange-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">系统验证</h3>
                <p className="text-sm text-gray-600 mb-4">验证Modbus主站系统的兼容性和可靠性，确保系统稳定运行</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    可模拟大规模设备网络
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    支持高并发请求
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    详细的通信日志
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
