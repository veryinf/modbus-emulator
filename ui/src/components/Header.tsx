import { ChevronDown, Cpu, Loader2, Github } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from '@tanstack/react-router';
import { DeviceProtocolLabels, searchDevices } from '../services/device';

export default function Header() {
  const { data: allDevices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: searchDevices,
    select: (x) => x.dataSet,
  });

  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isDevicesActive = currentPath.startsWith('/devices');

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3 mt-3">
          <Link to="/" className="flex items-center space-x-2">
            <Cpu className="text-blue-600 w-8 h-8" />
            <h1 className="text-xl font-bold text-gray-800">Modbus Emulator - Modbus从站模拟器</h1>
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`px-4 py-2 rounded transition-colors ${isActive('/') ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}>
              首页
            </Link>
            <div className="relative group">
              <a className={`px-4 py-2 transition-colors flex items-center ${isDevicesActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
                设备列表
                {isLoading ? <Loader2 className="ml-1 w-4 h-4 animate-spin" /> : <ChevronDown className="ml-1 w-4 h-4" />}
              </a>
              <div className="absolute left-0 top-full w-80 bg-white shadow-2xl rounded-md py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto border border-gray-200">
                {allDevices?.length ? (
                  allDevices.map((device) => (
                    <Link key={device.slaveId} to="/devices/$deviceId" params={{ deviceId: device.slaveId.toString() }} className={`block px-4 py-2 text-sm transition-colors ${currentPath === `/devices/${device.slaveId}` ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>
                      <div className="font-medium">{device.title}</div>
                      <div className="text-xs text-gray-500">设备通信协议：{DeviceProtocolLabels[device.protocol]}</div>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">{isLoading ? '加载中...' : '暂无设备'}</div>
                )}
              </div>
            </div>
            <Link to="/about" className={`px-4 py-2 rounded transition-colors ${isActive('/about') ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}>
              关于我们
            </Link>
            <a href="https://github.com/veryinf/modbus-emulator" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded transition-colors text-gray-600 hover:text-blue-600 flex items-center">
              <Github className="w-4 h-4 mr-1" /> GitHub
            </a>
          </div>
          <button className="md:hidden p-2 text-gray-600 hover:text-blue-600">
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
        <div className="md:hidden flex flex-col space-y-2">
          <Link to="/" className={`px-4 py-2 rounded transition-colors ${isActive('/') ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600 bg-gray-50'}`}>
            首页
          </Link>
          <a href="devices.html" className={`px-4 py-2 rounded transition-colors ${isDevicesActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600 bg-gray-50'}`}>
            设备管理
          </a>
          <Link to="/about" className={`px-4 py-2 rounded transition-colors ${isActive('/about') ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600 bg-gray-50'}`}>
            关于我们
          </Link>
          <a href="https://github.com/veryinf/modbus-emulator" target="_blank" rel="noopener noreferrer" className={`px-4 py-2 rounded transition-colors flex items-center text-gray-600 hover:text-blue-600 bg-gray-50`}>
            <Github className="w-4 h-4 mr-2" /> GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
