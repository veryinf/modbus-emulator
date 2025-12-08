import { z } from 'zod';
import { ProtocolType } from './types';

// 定义点位数据的 Zod 模式
const PointSchema = z.object({
  address: z.number().nonnegative(),
  value: z.union([z.boolean(), z.number()]),
});

// 定义点位集合的 Zod 模式
const PointsSchema = z.object({
  coils: z.array(PointSchema).optional(),
  discreteInputs: z.array(PointSchema).optional(),
  holdingRegisters: z.array(PointSchema).optional(),
  inputRegisters: z.array(PointSchema).optional(),
});

// 定义单个从站配置的 Zod 模式
const SlaveConfigSchema = z.object({
  slaveId: z.number().positive(),
  title: z.string().optional(),
  protocol: z.enum(ProtocolType),
  points: PointsSchema.optional(),
});

// 定义整个配置文件的 Zod 模式
export const ConfigSchema = z.array(SlaveConfigSchema);

// 验证配置的函数
export function validateConfig(config: unknown): z.infer<typeof ConfigSchema> {
  try {
    return ConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('配置文件验证失败:');
      error.issues.forEach((err) => {
        console.error(`  路径: ${err.path.join('.')}, 错误: ${err.message}`);
      });
    }
    throw error;
  }
}
