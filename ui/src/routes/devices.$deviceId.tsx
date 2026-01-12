import { useEffect, useState } from 'react';
import { Copy, Edit, Loader, XCircle } from 'lucide-react';
import { z, ZodError } from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchDevice, DeviceProtocolLabels, DevicePointTypeLabels, type PointType, setDevicePoint, type Device } from '../services/device';
import { useApplicationInfo } from '../services/app';
import { useToast } from '@/components/Toast';
import { invert } from 'lodash-es';
import { usePopupForm, type DefaultFormState, type FormSubmit } from '@/components/PopupForm';

const FilterSchema = z
  .object({
    type: z.enum(['coils', 'discreteInputs', 'holdingRegisters', 'inputRegisters']),
    viewType: z.enum(['bin', 'dec', 'hex']),
    start: z.number().int().min(0).max(65535),
    end: z.number().int().min(0).max(65535),
  })
  .refine((data) => data.start <= data.end, {
    message: '范围无效',
    path: ['start'],
  });
type Filter = z.infer<typeof FilterSchema>;

const FormInputSchema = z.object({
  address: z.number().int().min(0).max(65535),
  value: z.union([z.boolean(), z.number().min(0).max(65535)]),
});
type FormInput = z.infer<typeof FormInputSchema>;

type Point = {
  address: number;
  value: boolean | number;
};

const pointTypeMap: Record<string, PointType> = {
  coil: 'coils',
  discrete_input: 'discreteInputs',
  holding_register: 'holdingRegisters',
  input_register: 'inputRegisters',
};

function formatValue(value: boolean | number, type: string, viewType: string) {
  if (['coils', 'discreteInputs'].includes(type)) {
    return (value as boolean) ? '1' : '0';
  }
  const numValue = value as number;
  switch (viewType) {
    case 'bin':
      return numValue.toString(2).padStart(16, '0');
    case 'hex':
      return `0x${numValue.toString(16).toUpperCase().padStart(4, '0')}`;
    default:
      return numValue.toString();
  }
}

export const Route = createFileRoute('/devices/$deviceId')({
  component: DeviceConsolePage,
});

function DeviceConsolePage() {
  const [filter, setFilter] = useState<Filter>({ type: 'coils', viewType: 'dec', start: 0, end: 20 });
  const [filterError, setFilterError] = useState<ZodError | undefined>();

  const [points, setPoints] = useState<Device['points']>();
  const { Toast, toastRef } = useToast();
  const { PopupForm, Field, formRef } = usePopupForm<FormInput, DefaultFormState>();

  const { applicationInfo } = useApplicationInfo();

  const { deviceId: deviceIdStr } = Route.useParams();
  const deviceId = parseInt(deviceIdStr);

  const { data: device, isLoading } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => fetchDevice(deviceId),
    select: (x) => x.data,
  });

  useEffect(() => {
    if (device) {
      setPoints(device.points);
      const es = new EventSource(`/api/slaves/${deviceId}/subscribe`);
      es.addEventListener('message', (event) => {
        try {
          const msg = JSON.parse(event.data);
          const type = pointTypeMap[msg.type];
          setPoints((prevPoints) => {
            const localPoints = { ...prevPoints } as Device['points'];
            if (localPoints[type]) {
              const point = localPoints[type].find((point: Point) => point.address === msg.address);
              if (point) {
                point.value = msg.value;
              } else {
                localPoints[type].push({ address: msg.address, value: msg.value });
              }
            }
            return localPoints;
          });
        } catch (err) {
          console.error('Error parsing SSE data:', err);
        }
      });

      return () => {
        es.close();
      };
    }
  }, [device]);

  const handleFilterChange = (field: keyof Filter, value: string | number) => {
    const newFilter = { ...filter, [field]: value };
    const { success, error } = FilterSchema.safeParse(newFilter);
    if (success) {
      setFilter(newFilter);
      setFilterError(undefined);
    } else {
      setFilterError(error);
    }
  };

  const handleEditPoint = (point: PointItemProps['point']) => {
    formRef.current?.open(
      `编辑数据 ${DevicePointTypeLabels[filter.type as PointType]}`,
      {
        address: point.address,
        value: point.value,
      },
      { action: 'edit' },
    );
  };

  const handleSetPoint: FormSubmit<FormInput> = async ({ value }) => {
    try {
      const type = invert(pointTypeMap)[filter.type] as PointType;
      const res = await setDevicePoint(deviceId, type, value.address, value.value);
      if (res.errCode === 0) {
        toastRef.current?.show('success', '操作成功');
      } else {
        toastRef.current?.show('error', `操作失败: ${res.errMsg}`);
      }
    } catch (err) {
      toastRef.current?.show('error', '操作失败');
      console.error(err);
    }
  };

  const handleAddPoint = () => {
    formRef.current?.open(
      `新增数据 ${DevicePointTypeLabels[filter.type as PointType]}`,
      {
        address: 0,
        value: 0,
      },
      { action: 'add' },
    );
  };

  const handleCopyValue = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toastRef.current?.show('success', '值已复制到剪贴板');
      })
      .catch(() => {
        toastRef.current?.show('error', '复制失败, 请手动复制');
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!device) {
    return (
      <div className="p-4">
        <div className="border border-red-500 bg-red-50 rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
            <XCircle className="w-5 h-5" /> 错误
          </h3>
          <p className="text-red-600">设备不存在或无法加载</p>
        </div>
      </div>
    );
  }

  const filteredPoints = (points ?? {})[filter.type]?.filter((p: Point) => p.address >= filter.start && p.address <= filter.end).sort((a: Point, b: Point) => a.address - b.address);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{device.title}</h1>
              {device.description && <p className="text-sm text-gray-600 mb-3">{device.description}</p>}
              <div className="flex gap-2 text-sm text-gray-600">
                <span className="bg-gray-100 px-3 py-1 rounded">SlaveID: {device.slaveId}</span>
                <span className="bg-gray-100 px-3 py-1 rounded">Protocol: {DeviceProtocolLabels[device.protocol]}</span>
              </div>
            </div>

            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">连接方式</h1>
              <p className="text-sm text-gray-600 mb-3">请使用主站（Master）设备或模拟软件直接连接</p>
              <div className="flex gap-2 text-sm text-gray-600 justify-end">
                <span className="bg-gray-100 px-3 py-1 rounded">地址: {applicationInfo?.host || '127.0.0.1'}</span>
                <span className="bg-gray-100 px-3 py-1 rounded">端口: {applicationInfo?.port || 502}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm font-medium text-gray-700 mr-1">类型：</span>
            {Object.keys(DevicePointTypeLabels).map((type) => (
              <button key={type} type="button" className={`px-4 py-2 rounded text-sm font-medium transition-all ${filter.type === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => handleFilterChange('type', type)}>
                {DevicePointTypeLabels[type as PointType]}
              </button>
            ))}

            <span className="text-sm font-medium text-gray-700 mr-1 ml-4">格式：</span>
            {(['bin', 'dec', 'hex'] as const).map((viewType) => (
              <button key={viewType} type="button" disabled={['coils', 'discreteInputs'].includes(filter.type)} className={`px-4 py-2 rounded text-sm font-medium transition-all ${filter.viewType === viewType ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${['coils', 'discreteInputs'].includes(filter.type) ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => handleFilterChange('viewType', viewType)}>
                {viewType === 'bin' ? '2进制' : viewType === 'dec' ? '10进制' : '16进制'}
              </button>
            ))}

            <div className="relative group ml-1">
              <span className="text-sm font-medium text-gray-700 mr-1 ml-4">范围：</span>
              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">仅显示特定范围的数据点</div>
            </div>
            <input type="number" min={0} max={65535} value={filter.start} onChange={(e) => handleFilterChange('start', parseInt(e.target.value) || 0)} className="w-24 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="开始" />
            <span className="text-sm text-gray-600">-</span>
            <input type="number" min={0} max={65535} value={filter.end} onChange={(e) => handleFilterChange('end', parseInt(e.target.value) || 0)} className="w-24 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="结束" />
            {filterError && <span className="text-red-500 text-sm ml-2">{filterError.issues[0].message}</span>}
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            数据点列表
            <span className="ml-2 text-sm font-normal text-gray-500">({filteredPoints?.length || 0} 个)</span>
            <button type="button" className="ml-4 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center gap-1" onClick={handleAddPoint}>
              <span>+</span>
              <span>新增数据点</span>
            </button>
          </h2>

          {filteredPoints && filteredPoints.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {filteredPoints.map((point: Point) => (
                <PointItem key={point.address} point={point} type={filter.type} viewType={filter.viewType} onCopy={handleCopyValue} onEdit={handleEditPoint} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 text-sm bg-gray-50 rounded border border-gray-200">当前范围内没有数据点</p>
          )}
        </div>
      </main>
      <Toast />
      <PopupForm onSubmit={handleSetPoint}>
        {(_, formState) => (
          <>
            <Field name="address">
              {(field) => (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                  <input type="number" min={0} max={65535} value={field.state.value} onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)} disabled={formState?.action === 'edit'} className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none ${formState?.action === 'edit' ? 'bg-gray-50 text-gray-500' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`} />
                </div>
              )}
            </Field>

            <Field name="value">
              {(field) => (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">数据值</label>
                  {['coils', 'discreteInputs'].includes(filter.type) ? (
                    <div className="flex gap-2 w-10">
                      <button type="button" className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${field.state.value === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => field.handleChange(0)}>
                        0
                      </button>
                      <button type="button" className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${field.state.value === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => field.handleChange(1)}>
                        1
                      </button>
                    </div>
                  ) : (
                    <input type="number" min={0} max={65535} value={typeof field.state.value === 'boolean' ? 0 : field.state.value} onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  )}
                </div>
              )}
            </Field>
          </>
        )}
      </PopupForm>
    </div>
  );
}

type PointItemProps = {
  point: Point;
  type: Filter['type'];
  viewType: Filter['viewType'];
  onCopy: (value: string) => void;
  onEdit: (point: Point) => void;
};

function PointItem({ point, type, viewType, onCopy, onEdit }: PointItemProps) {
  const valueWidth = ['coils', 'discreteInputs'].includes(type) ? 'w-12' : viewType === 'bin' ? 'w-48' : 'w-24';
  const pointTypeLabel = ['coils', 'discreteInputs'].includes(type) ? '线圈' : '寄存器';
  const formattedValue = formatValue(point.value, type, viewType);

  return (
    <div className="flex items-center bg-gray-50 border border-gray-200 rounded hover:shadow-sm transition-shadow">
      <div className="relative group">
        <div className="px-4 py-2 bg-gray-100 text-sm font-medium border-r border-gray-200 rounded-l">{point.address}</div>
        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{pointTypeLabel}地址</div>
      </div>
      <div className={`px-4 py-2 text-sm font-mono ${valueWidth} text-center border-r border-gray-200`}>{formattedValue}</div>
      <div className="relative group">
        <button type="button" className="px-3 py-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors" onClick={() => onCopy(formattedValue)}>
          <Copy className="w-4 h-4" />
        </button>
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">复制值</div>
      </div>
      <div className="relative group">
        <button type="button" className="px-3 py-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors rounded-r" onClick={() => onEdit(point)}>
          <Edit className="w-4 h-4" />
        </button>
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">设置值</div>
      </div>
    </div>
  );
}
