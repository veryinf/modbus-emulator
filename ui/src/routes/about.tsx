import { createFileRoute } from '@tanstack/react-router';
import { Info, Star, Check, Lightbulb, Mail, Phone, MapPin, Clock, Users, FileText, Share2, Github, MessageCircle, Globe } from 'lucide-react';
import { useApplicationInfo } from '../services/app';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  const { applicationInfo } = useApplicationInfo();

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">关于我们</h2>
          <p className="text-gray-600">了解Modbus从站模拟器的更多信息</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Info className="text-blue-600 w-5 h-5 mr-2" /> 产品介绍
              </h3>
              <p className="text-gray-600 mb-4">Modbus从站模拟器是一款基于Web的Modbus从站设备模拟工具，旨在帮助开发者、工程师和教育工作者快速搭建和测试Modbus通信系统。</p>
              <p className="text-gray-600 mb-4">我们的产品支持多种Modbus协议（TCP、RTU、ASCII），可以同时模拟多个从站设备，并提供直观的Web界面进行配置和监控。</p>
              <p className="text-gray-600">无论您是进行Modbus主站开发测试、工业自动化系统集成，还是教育训练，我们的模拟器都能为您提供简单、高效、可靠的解决方案。</p>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Star className="text-blue-600 w-5 h-5 mr-2" /> 技术优势
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <Check className="text-blue-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">高性能</h4>
                    <p className="text-sm text-gray-600">基于Go语言开发，性能优秀，资源占用低</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <Check className="text-blue-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">双协议支持</h4>
                    <p className="text-sm text-gray-600">支持Modbus TCP和Modbus RTU over TCP协议</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <Check className="text-blue-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">多设备管理</h4>
                    <p className="text-sm text-gray-600">可在不同端口上运行和管理多个Modbus从站设备</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <Check className="text-blue-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">跨平台</h4>
                    <p className="text-sm text-gray-600">支持Windows、Linux和macOS</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <Check className="text-blue-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">实时事件订阅</h4>
                    <p className="text-sm text-gray-600">寄存器值变化时立即通知</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <Check className="text-blue-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">无需数据库</h4>
                    <p className="text-sm text-gray-600">基于内存存储，无外部依赖</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <Check className="text-blue-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">现代Web界面</h4>
                    <p className="text-sm text-gray-600">通过任何现代Web浏览器访问和控制模拟器</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <Check className="text-blue-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">简单配置</h4>
                    <p className="text-sm text-gray-600">通过JSON配置文件轻松设置设备</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Lightbulb className="text-blue-600 w-5 h-5 mr-2" /> 应用场景
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">开发测试</h4>
                  <p className="text-sm text-gray-600">为Modbus主站开发人员提供模拟设备，方便测试和调试代码</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">工业自动化</h4>
                  <p className="text-sm text-gray-600">在工业自动化系统中模拟各种Modbus设备，进行系统集成测试</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">教育训练</h4>
                  <p className="text-sm text-gray-600">用于教学和培训，帮助学生理解Modbus通信原理和协议</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">系统验证</h4>
                  <p className="text-sm text-gray-600">验证Modbus主站系统的兼容性和可靠性</p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <aside className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Mail className="text-blue-600 w-5 h-5 mr-2" /> 联系我们
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="text-gray-400 w-5 h-5 mr-3 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">邮箱</div>
                    <a href={`mailto:${applicationInfo?.email || 'support@modbussimulator.com'}`} className="text-blue-600 hover:underline">
                      {applicationInfo?.email || 'support@modbussimulator.com'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="text-gray-400 w-5 h-5 mr-3 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">电话</div>
                    <a href={`tel:${applicationInfo?.phone || '+8612345678910'}`} className="text-blue-600 hover:underline">
                      {applicationInfo?.phone || '+86 123 4567 8910'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="text-gray-400 w-5 h-5 mr-3 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">地址</div>
                    <div className="text-gray-600">{applicationInfo?.address || '北京市海淀区中关村科技园'}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="text-gray-400 w-5 h-5 mr-3 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">工作时间</div>
                    <div className="text-gray-600">{applicationInfo?.workingHours || '周一至周五 9:00-18:00'}</div>
                  </div>
                </div>
              </div>
            </aside>

            <aside className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="text-blue-600 w-5 h-5 mr-2" /> 支持与反馈
              </h3>
              <p className="text-gray-600 mb-4">如有问题、疑问或建议，请随时联系我们。我们提供多种支持方式：</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Mail className="text-blue-600 w-5 h-5 mr-3 mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-800">邮箱支持</div>
                    <a href={`mailto:${applicationInfo?.email || 'support@modbussimulator.com'}`} className="text-blue-600 hover:underline">
                      {applicationInfo?.email || 'support@modbussimulator.com'}
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <Github className="text-blue-600 w-5 h-5 mr-3 mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-800">GitHub Issues</div>
                    <a href={'https://github.com/veryinf/modbus-emulator/issues'} className="text-blue-600 hover:underline">
                      提交Issue
                    </a>
                  </div>
                </li>
              </ul>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FileText className="text-blue-600 w-5 h-5 mr-2" /> 许可证
                </h4>
                <p className="text-gray-600">
                  本项目采用{' '}
                  <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline">
                    MIT许可证
                  </a>
                  ，您可以自由使用、修改和分发。
                </p>
              </div>
            </aside>

            <aside className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Share2 className="text-blue-600 w-5 h-5 mr-2" /> 关注我们
              </h3>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <a href="https://github.com/veryinf/modbus-emulator" className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href={`mailto:${applicationInfo?.email || 'support@modbussimulator.com'}`} className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </a>
                  <a href={applicationInfo?.website || '#'} className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
                    <Globe className="w-5 h-5" />
                  </a>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium text-gray-800 mb-2">微信二维码</div>
                  <img src="/assets/images/wx.jpg" alt="微信二维码" className="w-32 h-32 rounded" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
