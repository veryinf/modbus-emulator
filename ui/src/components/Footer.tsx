import { useApplicationInfo } from '../services/app';
import { Link } from '@tanstack/react-router';

export default function Footer() {
  const { applicationInfo } = useApplicationInfo();

  return (
    <footer className="bg-white shadow-inner py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <i className="fas fa-microchip text-blue-600 text-2xl"></i>
              <h3 className="text-xl font-bold text-gray-800">Modbus从站模拟器</h3>
            </div>
            <p className="text-gray-600">基于Web的Modbus从站设备模拟工具，简单、高效、可靠</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link to="/devices/$deviceId" params={{ deviceId: '1' }} className="text-gray-600 hover:text-blue-600 transition-colors">
                  设备列表
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">功能</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" hash="quick-start" className="text-gray-600 hover:text-blue-600 transition-colors">
                  快速入门
                </Link>
              </li>
              <li>
                <Link to="/" hash="features" className="text-gray-600 hover:text-blue-600 transition-colors">
                  核心功能
                </Link>
              </li>
              <li>
                <Link to="/" hash="use-cases" className="text-gray-600 hover:text-blue-600 transition-colors">
                  应用场景
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">联系我们</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className="fas fa-envelope text-blue-600 mr-2"></i>
                <a href={`mailto:${applicationInfo?.email || 'support@modbussimulator.com'}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                  {applicationInfo?.email || 'support@modbussimulator.com'}
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone text-blue-600 mr-2"></i>
                <span className="text-gray-600">{applicationInfo?.phone || '+86 123 4567 8910'}</span>
              </li>
              <li>
                <img src="/assets/images/wx.jpg" alt="微信二维码" className="w-30 h-30 rounded" />
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
          <p>© 2024 Modbus从站模拟器. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
}
