---
sidebar_position: 6
---

# 字符串类型工具

字符串类型工具提供了强大的类型级字符串操作功能，实现诸如将驼峰命名转换为蛇形命名等转换。

## 大小写转换

### Camel2SnakeCase

将驼峰命名字符串转换为蛇形命名格式，可选择是否使用大写。

```typescript
type Camel2SnakeCase<T extends string, U extends boolean = true> = /* ... */

// 示例
type Result1 = Camel2SnakeCase<'userName'>; // 'USER_NAME'
type Result2 = Camel2SnakeCase<'userId'>; // 'USER_ID'
type Result3 = Camel2SnakeCase<'myVariableName'>; // 'MY_VARIABLE_NAME'

// 使用小写选项
type Result4 = Camel2SnakeCase<'userName', false>; // 'user_name'
type Result5 = Camel2SnakeCase<'userId', false>; // 'user_id'
type Result6 = Camel2SnakeCase<'myVariableName', false>; // 'my_variable_name'
```

**类型参数：**

- `T extends string` - 要转换的驼峰命名字符串
- `U extends boolean = true` - 是否使用大写（默认：`true`）

**返回值：**

- 蛇形命名格式的字符串类型

## 实际应用示例

### API 请求/响应映射

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface UserRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
}

// 将所有属性名转换为大写蛇形命名用于 API
type ApiUserRequest = {
  [K in keyof UserRequest as Camel2SnakeCase<K & string>]: UserRequest[K]
};

// 结果：
// {
//   FIRST_NAME: string;
//   LAST_NAME: string;
//   EMAIL_ADDRESS: string;
//   PHONE_NUMBER: string;
// }

// 使用示例
const apiPayload: ApiUserRequest = {
  FIRST_NAME: 'John',
  LAST_NAME: 'Doe',
  EMAIL_ADDRESS: 'john@example.com',
  PHONE_NUMBER: '+1234567890'
};
```

### 数据库列名映射

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface UserModel {
  userId: number;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// 转换为小写蛇形命名用于数据库列名
type DbUserColumns = {
  [K in keyof UserModel as Camel2SnakeCase<K & string, false>]: UserModel[K]
};

// 结果：
// {
//   user_id: number;
//   user_name: string;
//   created_at: Date;
//   updated_at: Date;
//   is_active: boolean;
// }

// 查询构建器示例
function buildQuery<T extends Record<string, unknown>>(
  tableName: string,
  data: T
): string {
  const columns = Object.keys(data).join(', ');
  const values = Object.values(data).map(v => `'${v}'`).join(', ');
  return `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
}

const userData: DbUserColumns = {
  user_id: 1,
  user_name: 'johndoe',
  created_at: new Date(),
  updated_at: new Date(),
  is_active: true
};

const query = buildQuery('users', userData);
```

### 环境变量命名

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface AppConfig {
  databaseUrl: string;
  apiKey: string;
  maxConnections: number;
  enableLogging: boolean;
  redisHost: string;
}

// 转换为大写蛇形命名用于环境变量
type EnvVars = {
  [K in keyof AppConfig as Camel2SnakeCase<K & string>]: string
};

// 结果：
// {
//   DATABASE_URL: string;
//   API_KEY: string;
//   MAX_CONNECTIONS: string;
//   ENABLE_LOGGING: string;
//   REDIS_HOST: string;
// }

// 环境变量加载器
function loadEnv<T extends Record<string, unknown>>(
  keys: Array<keyof T>
): T {
  const result: Record<string, string> = {};

  for (const key of keys) {
    const envKey = String(key);
    result[envKey] = process.env[envKey] || '';
  }

  return result as T;
}

const env = loadEnv<EnvVars>([
  'DATABASE_URL',
  'API_KEY',
  'MAX_CONNECTIONS',
  'ENABLE_LOGGING',
  'REDIS_HOST'
]);
```

### GraphQL 模式生成

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface Product {
  productId: string;
  productName: string;
  productPrice: number;
  productCategory: string;
}

// 生成 GraphQL 字段名（小写蛇形命名）
type GraphQLProduct = {
  [K in keyof Product as Camel2SnakeCase<K & string, false>]: Product[K]
};

// 结果：
// {
//   product_id: string;
//   product_name: string;
//   product_price: number;
//   product_category: string;
// }

const graphqlType = `
  type Product {
    product_id: String!
    product_name: String!
    product_price: Float!
    product_category: String!
  }
`;
```

### 表单字段名称转换

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface FormData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  companyName?: string;
}

// 转换为蛇形命名用于 HTML 表单字段名
type FormFieldNames = {
  [K in keyof FormData as Camel2SnakeCase<K & string, false>]: FormData[K]
};

// 结果：
// {
//   first_name: string;
//   last_name: string;
//   email_address: string;
//   phone_number: string;
//   company_name?: string;
// }

// 表单生成器
function generateFormFields<T extends Record<string, unknown>>(
  data: T
): string {
  return Object.entries(data)
    .map(([key, value]) => {
      return `<input name="${key}" value="${value || ''}" />`;
    })
    .join('\n');
}

const formData: FormFieldNames = {
  first_name: 'John',
  last_name: 'Doe',
  email_address: 'john@example.com',
  phone_number: '+1234567890',
  company_name: 'Acme Inc'
};

const formHtml = generateFormFields(formData);
```

### 常量定义

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface ErrorCodes {
  notFound: number;
  unauthorized: number;
  badRequest: number;
  internalError: number;
}

// 转换为大写蛇形命名用于常量
type ErrorConstants = {
  [K in keyof ErrorCodes as Camel2SnakeCase<K & string>]: ErrorCodes[K]
};

// 结果：
// {
//   NOT_FOUND: number;
//   UNAUTHORIZED: number;
//   BAD_REQUEST: number;
//   INTERNAL_ERROR: number;
// }

const HTTP_STATUS: ErrorConstants = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  INTERNAL_ERROR: 500
};

// 代码中使用
function handleError(code: keyof ErrorConstants) {
  return HTTP_STATUS[code];
}

const statusCode = handleError('NOT_FOUND'); // 404
```

### 配置文件键名

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface ServerConfig {
  serverHost: string;
  serverPort: number;
  maxUploadSize: number;
  enableCors: boolean;
  corsOrigin: string[];
}

// 转换为小写蛇形命名用于配置文件（YAML/TOML）
type ConfigFileKeys = {
  [K in keyof ServerConfig as Camel2SnakeCase<K & string, false>]: ServerConfig[K]
};

// 结果：
// {
//   server_host: string;
//   server_port: number;
//   max_upload_size: number;
//   enable_cors: boolean;
//   cors_origin: string[];
// }

// 配置文件内容
const config: ConfigFileKeys = {
  server_host: '0.0.0.0',
  server_port: 3000,
  max_upload_size: 10485760, // 10MB
  enable_cors: true,
  cors_origin: ['http://localhost:3000', 'https://example.com']
};

// 生成 YAML
function toYaml(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
      }
      return `${key}: ${value}`;
    })
    .join('\n');
}

const yamlConfig = toYaml(config);
```

## 类型安全优势

### 编译时验证

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

// 类型安全的键名转换
function transformKeys<T extends Record<string, unknown>>(
  obj: T
): { [K in keyof T as Camel2SnakeCase<K & string, false>]: T[K] } {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    // 运行时将驼峰命名转换为蛇形命名
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }

  return result as { [K in keyof T as Camel2SnakeCase<K & string, false>]: T[K] };
}

// 使用示例
const camelCaseData = {
  firstName: 'John',
  lastName: 'Doe',
  emailAddress: 'john@example.com'
};

const snakeCaseData = transformKeys(camelCaseData);
// TypeScript 知道结果类型：
// {
//   first_name: string;
//   last_name: string;
//   email_address: string;
// }

// 类型安全的访问
console.log(snakeCaseData.first_name); // 正确
// console.log(snakeCaseData.firstName); // 错误：属性 'firstName' 不存在
```

### 与其他工具集成

```typescript
import type { Camel2SnakeCase, KeyOf, ValueOf } from 'typescript-api-pro';

interface User {
  userId: number;
  userName: string;
  userEmail: string;
}

// 转换键名
type DbUser = {
  [K in keyof User as Camel2SnakeCase<K & string, false>]: User[K]
};

// 获取所有可能的值
type DbUserValue = ValueOf<DbUser>; // number | string

// 获取所有键名
type DbUserKey = KeyOf<DbUser>; // 'user_id' | 'user_name' | 'user_email'

// 类型安全的查询构建器
function buildSelectQuery<T extends Record<string, unknown>>(
  table: string,
  columns: Array<keyof T>
): string {
  return `SELECT ${columns.join(', ')} FROM ${table}`;
}

const query = buildSelectQuery<DbUser>('users', ['user_id', 'user_name']);
// 结果："SELECT user_id, user_name FROM users"
```

## 实现细节

`Camel2SnakeCase` 类型使用递归条件类型来处理每个字符：

1. **Fmt 辅助函数**：根据布尔标志将字符转换为大写或小写
2. **ToSnakeCase**：递归处理字符串，在大写字母前添加下划线
3. **Camel2SnakeCase**：如果存在前导下划线则将其删除，并应用转换

这提供了编译时类型转换，零运行时开销，确保整个应用程序的类型安全。
