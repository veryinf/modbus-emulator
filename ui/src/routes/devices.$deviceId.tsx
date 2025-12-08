import { useEffect, useState } from 'react';
import { Copy, Settings, SquarePen } from 'lucide-react';
import { z, ZodError } from 'zod';
import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { type Device, DevicePointTypeLabels, DeviceProtocolLabels, fetchDevice, type PointType, setDevicePoint } from '@/services/device';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export const Route = createFileRoute('/devices/$deviceId')({
  component: SlaveDetailPage,
});

const FilterSchema = z.object({
  type: z.enum(['coils', 'discreteInputs', 'holdingRegisters', 'inputRegisters']),
  viewType: z.enum(['bin', 'dec', 'hex']),
  start: z.number().int().min(0).max(65535),
  end: z.number().int().min(0).max(65535),
});
const InputSchema = z.object({
  open: z.boolean(),
  address: z.number().int().min(0).max(65535),
  valueType: z.enum(['boolean', 'number', 'hex']),
  valueHex: z.string().length(4),
  value: z.union([z.boolean(), z.number().min(0).max(65535)]),
});

function SlaveDetailPage() {
  const [filter, setFilter] = useState<z.infer<typeof FilterSchema>>({ type: 'coils', viewType: 'dec', start: 0, end: 20 });
  const [input, setInput] = useState<z.infer<typeof InputSchema>>({ open: false, address: 0, valueType: 'number', valueHex: '0000', value: 0 });
  const [points, setPoints] = useState<Device['points']>();
  const [validate, setValidate] = useState<{ filterValidate?: ZodError; inputValidate?: ZodError }>({});

  const { deviceId: deviceIdStr } = Route.useParams();
  const deviceId = parseInt(deviceIdStr);
  const { data: device, isLoading } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => {
      return fetchDevice(deviceId);
    },
    select: (x) => x.data,
  });
  useEffect(() => {
    if (device) {
      setPoints(device?.points);
    }
  }, [device]);

  useEffect(() => {
    if (points) {
      const es = new EventSource(`/api/slaves/${deviceId}/subscribe`);
      es.addEventListener('message', (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.slaveId === deviceId) {
            setPoints((prevPoints) => {
              const localPoints = prevPoints as any;
              if (localPoints[msg.type]) {
                const point = localPoints[msg.type].find((point: any) => point.address === msg.address);
                if (point) {
                  point.value = msg.value;
                } else {
                  localPoints[msg.type].push({ address: msg.address, value: msg.value });
                }
              }
              return { ...prevPoints, ...localPoints };
            });
          }
        } catch (err) {
          console.error('Error parsing SSE data:', err);
        }
      });

      es.addEventListener('error', (event) => {
        console.error('SSE error:', event);
      });

      return () => {
        es.close();
      };
    }
  }, [points]);

  async function handleSetPoint() {
    const pInput = { ...input };
    switch (pInput.valueType) {
      case 'boolean':
        pInput.value = pInput.value ? 1 : 0;
        break;
      case 'hex':
        pInput.value = parseInt(pInput.valueHex, 16);
        break;
    }
    const { success, error, data } = InputSchema.safeParse(pInput);
    if (success) {
      setValidate({ ...validate, inputValidate: undefined });
      const res = await setDevicePoint(deviceId, filter.type, data.address, data.value);
      if (res.errCode === 0) {
        setInput({ ...pInput, open: false });
        toast.success('操作成功', { description: '成功更新设备数据' });
      } else {
        toast.error('操作失败', { description: res.errMsg });
      }
    } else {
      setValidate({ ...validate, inputValidate: error });
      console.log(input, error);
    }
  }

  function handleFilter(filed: keyof z.infer<typeof FilterSchema>, value: string | number) {
    const newFilter = { ...filter, [filed]: value };
    const { success, error, data } = FilterSchema.safeParse(newFilter);
    if (success) {
      setFilter(data);
      setValidate({ ...validate, filterValidate: undefined });
    } else {
      setValidate({ ...validate, filterValidate: error });
      console.log(newFilter, error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Warning! </strong>
          <span className="block sm:inline">No slave data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="flex items-center gap-4">
        <h1 className="text-2xl font-bold mb-2">{device.title}</h1>
        <div className="text-gray-600 mb-1">SlaveID: {device.slaveId}</div>
        <div className="text-gray-600 mb-1">Protocol: {DeviceProtocolLabels[device.protocol]}</div>
      </header>
      <div className="flex items-start gap-2">
        <ToggleGroup type="single" variant="outline" value={filter.type} onValueChange={(type) => handleFilter('type', type)}>
          {Object.keys(DevicePointTypeLabels).map((type) => (
            <ToggleGroupItem value={type} key={type}>
              {DevicePointTypeLabels[type as PointType]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ToggleGroup disabled={['coils', 'discreteInputs'].includes(filter.type)} type="single" variant="outline" value={filter.viewType} onValueChange={(viewType) => handleFilter('viewType', viewType)}>
          <ToggleGroupItem value="bin">2进制</ToggleGroupItem>
          <ToggleGroupItem value="dec">10进制</ToggleGroupItem>
          <ToggleGroupItem value="hex">16进制</ToggleGroupItem>
        </ToggleGroup>
        <Field data-invalid={false} orientation="horizontal">
          <ButtonGroup>
            <Input placeholder="开始地址" type="number" min={0} max={65535} className="text-right w-25" value={filter.start} onChange={(e) => handleFilter('start', parseInt(e.target.value))} />
            <Input placeholder="结束地址" type="number" min={0} max={65535} className="text-right" value={filter.end} onChange={(e) => handleFilter('end', parseInt(e.target.value))} />
            <Button variant="outline" title="按照范围设置显示选项">
              <Settings />
            </Button>
          </ButtonGroup>
          <FieldError>{validate.filterValidate?.issues[0].message}</FieldError>
        </Field>
      </div>

      <div className="mt-4 mb-4">
        <h2 className="text-xl font-semibold mb-4">Points</h2>
        <div className="flex gap-2">
          {(points ?? {})[filter.type]
            ?.filter((p) => p.address >= filter.start && p.address <= filter.end)
            .map((point) => {
              const output = { value: point.value.toString(), title: '寄存器', valueWidth: 'w-20' };
              if (['coils', 'discreteInputs'].includes(filter.type)) {
                output.title = '线圈';
                output.value = point.value ? '1' : '0';
                output.valueWidth = 'w-10';
              } else {
                if (filter.viewType === 'bin') {
                  output.value = point.value.toString(2).padStart(16, '0');
                  output.valueWidth = 'w-40';
                }
                if (filter.viewType === 'hex') {
                  output.value = '0x' + point.value.toString(16).toUpperCase().padStart(4, '0');
                }
              }
              return (
                <ButtonGroup key={point.address}>
                  <LeTooltip title={`${output.title}地址`}>
                    <span className="inline-flex items-center justify-center pl-4 pr-4 bg-secondary hover:bg-secondary/80 rounded-md">Address：{point.address}</span>
                  </LeTooltip>
                  <ButtonGroupSeparator />
                  <LeTooltip title={`${output.title}值`}>
                    <span className={`inline-flex items-center justify-center pl-4 pr-4 bg-secondary hover:bg-secondary/80 rounded-md ${output.valueWidth}`}>{output.value}</span>
                  </LeTooltip>
                  <ButtonGroupSeparator />
                  <LeTooltip title="复制值">
                    <Button size="icon" variant="secondary" className="cursor-pointer" onClick={() => navigator.clipboard.writeText(output.value).then(() => toast.success('复制成功'))}>
                      <Copy />
                    </Button>
                  </LeTooltip>
                  <ButtonGroupSeparator />
                  <LeTooltip title="设置值">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => {
                        setInput({
                          open: true,
                          address: point.address,
                          valueType: ['coils', 'discreteInputs'].includes(filter.type) ? 'boolean' : 'number',
                          valueHex: point.value.toString(16).toUpperCase().padStart(4, '0'),
                          value: point.value,
                        });
                        setValidate({ ...validate, inputValidate: undefined });
                      }}
                    >
                      <SquarePen />
                    </Button>
                  </LeTooltip>
                </ButtonGroup>
              );
            })}
        </div>
      </div>
      <Dialog open={input.open} onOpenChange={(open) => setInput({ ...input, open })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>编辑数据 {DevicePointTypeLabels[filter.type]} </DialogTitle>
            <DialogDescription>直接编辑特定Point的数值(注意：此操作并非通过Modbus写入协议，而是直接编辑)</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="address">地址</Label>
              <Button variant="secondary" className="w-20">
                {input.address}
              </Button>
            </div>
            {input.valueType === 'boolean' ? (
              <div className="grid gap-3">
                <Label htmlFor="value">数据值</Label>
                <ToggleGroup type="single" variant="outline" value={input.value ? '1' : '0'} onValueChange={(val) => setInput({ ...input, value: val === '1' })}>
                  <ToggleGroupItem value="0" className="w-20">
                    0
                  </ToggleGroupItem>
                  <ToggleGroupItem value="1" className="w-20">
                    1
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            ) : (
              <>
                <Label htmlFor="value">数据类型</Label>
                <ToggleGroup type="single" variant="outline" value={input.valueType} onValueChange={(val) => setInput({ ...input, valueType: val as any })}>
                  <ToggleGroupItem value="number">10进制</ToggleGroupItem>
                  <ToggleGroupItem value="hex">16进制</ToggleGroupItem>
                </ToggleGroup>
                <Label htmlFor="value">数据</Label>
                {input.valueType === 'hex' ? (
                  <div className="flex gap-2">
                    <Button variant="secondary" className="w-10">
                      0x
                    </Button>
                    <InputOTP maxLength={6} pattern="^[a-fA-F0-9]+$" value={input.valueHex} onChange={(e) => setInput({ ...input, valueHex: e.toUpperCase() })}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                ) : (
                  <Input placeholder="数据值" type="number" value={input.value.toString()} min={0} max={65535} onChange={(e) => setInput({ ...input, value: parseInt(e.target.value) })} />
                )}
                <FieldError>{validate.inputValidate?.issues[0].message}</FieldError>
              </>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSetPoint}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster richColors position="top-right" />
    </div>
  );
}

function LeTooltip(props: React.PropsWithChildren<{ title?: string }>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{props.children}</TooltipTrigger>
      <TooltipContent>
        <p>{props.title}</p>
      </TooltipContent>
    </Tooltip>
  );
}
