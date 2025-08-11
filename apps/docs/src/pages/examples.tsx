import CodeBlock from '@theme/CodeBlock';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import React from 'react';

export default function Examples(): JSX.Element {
  return (
    <Layout
      title="使用示例"
      description="TypeScript API Pro 实际使用示例"
    >
      <div className="container margin-vert--lg">
        <Heading as="h1">使用示例</Heading>
        <p>这里展示了 TypeScript API Pro 在实际项目中的使用示例。</p>

        <section className="margin-vert--lg">
          <Heading as="h2">配置管理示例</Heading>
          <p>使用 RequiredDependency 确保配置的完整性：</p>
          <CodeBlock language="typescript">
            {`import type { RequiredDependency } from 'typescript-api-pro';

interface DatabaseConfig {
  name: string;
  host?: string;
  port?: number;
  ssl?: boolean;
}

// 确保 host 和 port 同时存在或同时不存在
type SafeDatabaseConfig = RequiredDependency<DatabaseConfig, 'host', 'port'>;

// ✅ 正确的配置
const config1: SafeDatabaseConfig = {
  name: 'mydb',
  host: 'localhost',
  port: 5432,
  ssl: true
};

// ✅ 正确的配置（不提供连接信息）
const config2: SafeDatabaseConfig = {
  name: 'mydb',
  ssl: false
};

// ❌ 错误：不能只提供 host 而不提供 port
// const config3: SafeDatabaseConfig = {
//   name: 'mydb',
//   host: 'localhost'  // TypeScript 错误
// };`}
          </CodeBlock>
        </section>

        <section className="margin-vert--lg">
          <Heading as="h2">表单验证示例</Heading>
          <p>使用 MutuallyWithObject 处理互斥的表单字段：</p>
          <CodeBlock language="typescript">
            {`import type { MutuallyWithObject } from 'typescript-api-pro';

interface LoginOptions {
  username: string;
  email: string;
  phone: string;
}

// 只能选择一种登录方式
type LoginMethod = MutuallyWithObject<LoginOptions>;

// ✅ 使用用户名登录
const loginWithUsername: LoginMethod = {
  username: 'john_doe'
};

// ✅ 使用邮箱登录
const loginWithEmail: LoginMethod = {
  email: 'john@example.com'
};

// ✅ 使用手机号登录
const loginWithPhone: LoginMethod = {
  phone: '13812345678'
};

// ❌ 错误：不能同时提供多种登录方式
// const invalidLogin: LoginMethod = {
//   username: 'john_doe',
//   email: 'john@example.com'  // TypeScript 错误
// };`}
          </CodeBlock>
        </section>

        <section className="margin-vert--lg">
          <Heading as="h2">权限管理示例</Heading>
          <p>使用 Set 类型工具管理用户权限：</p>
          <CodeBlock language="typescript">
            {`import type { 
  ArrayToSet, 
  OmitSetValue, 
  PickSetValue,
  SetValueOf 
} from 'typescript-api-pro';

// 系统所有权限
const allPermissions = [
  'read', 'write', 'delete', 'admin', 'superadmin'
] as const;

type AllPermissions = ArrayToSet<typeof allPermissions>;
// Set<'read' | 'write' | 'delete' | 'admin' | 'superadmin'>

// 普通用户权限（排除管理员权限）
type UserPermissions = OmitSetValue<AllPermissions, 'admin' | 'superadmin'>;
// Set<'read' | 'write' | 'delete'>

// 管理员权限
type AdminPermissions = PickSetValue<AllPermissions, 'admin'>;
// Set<'admin'>

// 权限检查函数
function hasPermission(
  userPermissions: Set<SetValueOf<UserPermissions>>,
  required: SetValueOf<UserPermissions>
): boolean {
  return userPermissions.has(required);
}

// 使用示例
const userPerms = new Set(['read', 'write'] as const);
const canDelete = hasPermission(userPerms, 'delete'); // false
const canRead = hasPermission(userPerms, 'read'); // true`}
          </CodeBlock>
        </section>

        <section className="margin-vert--lg">
          <Heading as="h2">API 响应处理示例</Heading>
          <p>使用 Mutually 确保 API 响应状态的互斥性：</p>
          <CodeBlock language="typescript">
            {`import type { Mutually, ValueOf } from 'typescript-api-pro';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  loading: boolean;
  timestamp: number;
}

// 确保 data 和 error 不会同时存在
type SafeApiResponse<T> = Mutually<ApiResponse<T>, 'data', 'error'>;

// 定义响应状态
interface ResponseStates {
  success: { data: any; loading: false };
  error: { error: string; loading: false };
  loading: { loading: true };
}

type ResponseState = ValueOf<ResponseStates>;

// 处理 API 响应的函数
function handleApiResponse<T>(response: SafeApiResponse<T>) {
  if ('data' in response && response.data !== undefined) {
    console.log('请求成功:', response.data);
  } else if ('error' in response && response.error !== undefined) {
    console.error('请求失败:', response.error);
  }
  
  if (response.loading) {
    console.log('请求进行中...');
  }
}

// 使用示例
const successResponse: SafeApiResponse<User[]> = {
  data: [{ id: 1, name: '张三' }],
  loading: false,
  timestamp: Date.now()
};

const errorResponse: SafeApiResponse<User[]> = {
  error: '网络连接失败',
  loading: false,
  timestamp: Date.now()
};

handleApiResponse(successResponse);
handleApiResponse(errorResponse);`}
          </CodeBlock>
        </section>

        <section className="margin-vert--lg">
          <Heading as="h2">Map 和对象转换示例</Heading>
          <p>使用 Map 类型工具进行类型安全的转换：</p>
          <CodeBlock language="typescript">
            {`import type { 
  MapToObject, 
  ObjectToMap, 
  MapKeyOf, 
  MapValueOf 
} from 'typescript-api-pro';

// 配置对象
interface AppConfig {
  host: string;
  port: number;
  ssl: boolean;
  debug: boolean;
}

// 对象转 Map
type ConfigMap = ObjectToMap<AppConfig>;
// Map<'host' | 'port' | 'ssl' | 'debug', string | number | boolean>

// Map 转对象
type ConfigFromMap = MapToObject<ConfigMap>;
// { host: string | number | boolean; port: string | number | boolean; ... }

// 提取 Map 的键和值类型
type ConfigKeys = MapKeyOf<ConfigMap>; // 'host' | 'port' | 'ssl' | 'debug'
type ConfigValues = MapValueOf<ConfigMap>; // string | number | boolean

// 实用工具函数
function objectToMap<T extends Record<string, any>>(obj: T): ObjectToMap<T> {
  return new Map(Object.entries(obj)) as ObjectToMap<T>;
}

function mapToObject<T extends Map<string, any>>(map: T): MapToObject<T> {
  const obj = {} as MapToObject<T>;
  for (const [key, value] of map) {
    (obj as any)[key] = value;
  }
  return obj;
}

// 使用示例
const config: AppConfig = {
  host: 'localhost',
  port: 3000,
  ssl: false,
  debug: true
};

const configMap = objectToMap(config);
const configBack = mapToObject(configMap);

console.log('原始配置:', config);
console.log('Map 配置:', configMap);
console.log('转换回的配置:', configBack);`}
          </CodeBlock>
        </section>

        <div className="margin-vert--xl">
          <p>
            想要了解更多使用方法？查看我们的
            {' '}
            <a href="/docs/api/overview">完整 API 文档</a>
            。
          </p>
        </div>
      </div>
    </Layout>
  );
}
