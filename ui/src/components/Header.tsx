import { BadgeInfo, House, Microchip } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Link } from '@tanstack/react-router';
import logo from '../logo.svg';
import { DeviceProtocolLabels, searchDevices } from '@/services/device';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from './ui/spinner';

export default function Header() {
  const { data: allDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: searchDevices,
    select: (x) => x.dataSet,
  });
  return (
    <>
      <header className="sticky top-0 z-50 p-4 flex items-center bg-white shadow-lg">
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/">
            <img src={logo} className="h-10 pointer-events-none animate-[spin_20s_linear_infinite]" alt="logo" />
          </Link>
        </h1>
        <div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/" className="flex-row items-center gap-2">
                    <House size={16} />
                    首页
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger className="flex-row items-center gap-2 ">
                  <Microchip size={16} />
                  设备列表
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  {allDevices ? (
                    <ul className="grid w-[300px] gap-4">
                      <li>
                        {allDevices.map((device) => (
                          <NavigationMenuLink asChild key={device.slaveId}>
                            <Link to="/devices/$deviceId" params={{ deviceId: device.slaveId.toString() }}>
                              <div className="font-medium">{device.title}</div>
                              <div className="text-muted-foreground">设备通信协议：{DeviceProtocolLabels[device.protocol]}</div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </li>
                    </ul>
                  ) : (
                    <div className="flex justify-center h-10 p-4">
                      <Spinner className="size-8" />
                    </div>
                  )}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuIndicator className="NavigationMenuIndicator" />
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/about" className="flex-row items-center gap-2">
                    <BadgeInfo />
                    关于
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
    </>
  );
}
