---
sidebar_position: 1.5
---

# 快速上手指南

本指南将帮助你快速开始使用 TypeScript API Pro，通过实际示例了解各种类型工具的使用方法。

## 安装

首先安装 TypeScript API Pro：

```bash
npm install typescript-api-pro
```

或者使用 yarn：

```bash
yarn add typescript-api-pro
```

## 基础使用

### 导入类型工具

```typescript
// 导入单个类型工具
// eslint-disable-next-line import/no-duplicates
import type { AnyObject, ValueOf } from 'typescript-api-pro';

// 导入多个类型工具
import type {
  ArrayItem,
  MapToObject,
  MutuallyWithObject,
  RequiredDependency
// eslint-disable-next-line import/no-duplicates
} from 'typescript-api-pro';
```

### 第一个示例

让我们从一个简单的配置对象开始：

```typescript
import type { AnyObject, ValueOf } from 'typescript-api-pro';

// 定义一个通用配置对象
interface AppConfig {
  database: {
    host: string;
    port: number;
  };
  server: {
    port: number;
    ssl: boolean;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    file: string;
  };
}

// 提取所有配置值的类型
type ConfigValue = ValueOf<AppConfig>;

// 创建一个通用的配置存储
type ConfigStore = AnyObject<ConfigValue>;
```

## 常见使用场景

### 1. 表单验证

处理表单中的互斥字段：

```typescript
import type { MutuallyWithObject, RequiredDependency } from 'typescript-api-pro';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  newsletter?: boolean;
  sms?: boolean;
}

// 只能选择一种联系方式
type ContactMethod = MutuallyWithObject<Pick<ContactForm, 'email' | 'phone'>>;

// 如果选择接收短信，必须提供手机号
type FormWithSMS = RequiredDependency<ContactForm, 'sms', 'phone'>;
```

### 2. API 响应处理

处理 API 响应的不同状态：

```typescript
import type { Mutually, ValueOf } from 'typescript-api-pro';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  loading: boolean;
  timestamp: number;
}

// 确保 data 和 error 不会同时存在
type SafeApiResponse<T> = Mutually<ApiResponse<T>, 'data', 'error'>;
```

### 3. 数组和集合操作

处理数组和集合类型：

```typescript
import type { ArrayItem, ArrayToSet, SetValueOf } from 'typescript-api-pro';

// 用户权限数组
const permissions = ['read', 'write', 'delete', 'admin'] as const;
type Permission = ArrayItem<typeof permissions>;

// 转换为 Set 类型（自动去重）
type PermissionSet = ArrayToSet<typeof permissions>;

// 提取 Set 元素类型
type PermissionElement = SetValueOf<PermissionSet>;
```

## 下一步

现在你已经了解了 TypeScript API Pro 的基本用法，可以：

1. 查看 [API 参考文档](./api/overview) 了解所有可用的类型工具
2. 探索具体的类型分类：
   - [对象类型工具](./api/object-types)
   - [数组类型工具](./api/array-types)
   - [Map 类型工具](./api/map-types)
   - [Set 类型工具](./api/set-types)
3. 在你的项目中开始使用这些类型工具

如果遇到问题，欢迎在 [GitHub Issues](https://github.com/JsonLee12138/typescript-api-pro/issues) 中提问！
