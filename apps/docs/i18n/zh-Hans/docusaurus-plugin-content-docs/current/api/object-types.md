---
sidebar_position: 2
---

# 对象类型工具

对象类型工具提供了强大的工具来操作和转换 TypeScript 中的对象类型。

## 基础类型

### PropertyKey

标准的 TypeScript 属性键类型。

```typescript
type PropertyKey = string | number | symbol;
```

### AnyObject

具有灵活键值对的通用对象类型。

```typescript
type AnyObject<T = any> = Record<PropertyKey, T>;

// 使用示例
type StringObject = AnyObject<string>; // Record<PropertyKey, string>
type NumberObject = AnyObject<number>; // Record<PropertyKey, number>
```

## 值和键提取

### ValueOf

从对象类型中提取所有可能的值类型。

```typescript
type ValueOf<T> = T[keyof T];

// 示例
interface User {
  id: number;
  name: string;
  active: boolean;
}

type UserValue = ValueOf<User>; // number | string | boolean
```

### KeyOf

从对象中提取所有键类型（`keyof` 的别名）。

```typescript
type KeyOf<T> = keyof T;

// 示例
type UserKeys = KeyOf<User>; // "id" | "name" | "active"
```

## 属性覆盖

### Generic

覆盖对象中特定属性的类型。

```typescript
type Generic<R, K extends keyof R, T> = Omit<R, K> & Record<K, T>;

// 示例
interface User {
  id: number;
  name: string;
  createdAt: Date;
}

// 将 createdAt 覆盖为字符串类型
type UserWithStringDate = Generic<User, 'createdAt', string>;
// 结果: { id: number; name: string; createdAt: string; }
```

## 高级过滤

### OmitByObject

基于另一个对象的结构从对象中排除属性。

```typescript
type OmitByObject<T, U> = Omit<T, keyof U>;

// 示例
interface FullUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface SensitiveFields {
  password: string;
}

type PublicUser = OmitByObject<FullUser, SensitiveFields>;
// 结果: { id: number; name: string; email: string; }
```

## 依赖关系

### RequiredDependency

在对象属性之间创建依赖关系。

```typescript
type RequiredDependency<T, K extends keyof T, D extends keyof T>
  = Omit<T, D> & (Partial<{ [P in K | D]: never }> | Required<Pick<T, K | D>>);

// 示例
interface DatabaseConfig {
  host?: string;
  port?: number;
  ssl?: boolean;
}

// 当提供 host 时，也必须提供 port
type SafeConfig = RequiredDependency<DatabaseConfig, 'host', 'port'>;

const config1: SafeConfig = { ssl: true }; // ✅ 有效
const config2: SafeConfig = { host: 'localhost', port: 3306 }; // ✅ 有效
const config3: SafeConfig = { host: 'localhost' }; // ❌ 错误：需要 port
```

## 互斥

### MutuallyWithObject

从对象类型创建互斥属性。

```typescript
type MutuallyWithObject<T> = {
  [K in keyof T]: Record<K, T[K]> & Partial<Record<Exclude<keyof T, K>, never>>;
}[keyof T];

// 示例
interface AuthMethods {
  token: string;
  username: string;
  apiKey: string;
}

type AuthMethod = MutuallyWithObject<AuthMethods>;

const auth1: AuthMethod = { token: 'abc123' }; // ✅ 有效
const auth2: AuthMethod = { username: 'john' }; // ✅ 有效
const auth3: AuthMethod = { token: 'abc', username: 'john' }; // ❌ 错误：互斥
```

### Mutually

在两个特定属性之间创建互斥。

```typescript
type Mutually<T, K extends keyof T, O extends keyof T>
  = (T & Record<K, T[K]> & Partial<Record<O, never>>)
    | (T & Record<O, T[O]> & Partial<Record<K, never>>);

// 示例
interface PaymentOptions {
  amount: number;
  creditCard?: string;
  paypal?: string;
}

type Payment = Mutually<PaymentOptions, 'creditCard', 'paypal'>;

const payment1: Payment = { amount: 100, creditCard: '1234' }; // ✅ 有效
const payment2: Payment = { amount: 100, paypal: 'user@example.com' }; // ✅ 有效
const payment3: Payment = { amount: 100, creditCard: '1234', paypal: 'user@example.com' }; // ❌ 错误
```

## 实际应用示例

### API 配置

```typescript
import type { MutuallyWithObject, RequiredDependency } from 'typescript-api-pro';

interface APIConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  auth?: {
    token?: string;
    basic?: { username: string; password: string };
    oauth?: { clientId: string; clientSecret: string };
  };
}

// 确保 timeout 和 retries 协同工作
type ReliableAPIConfig = RequiredDependency<APIConfig, 'timeout', 'retries'>;

// 确保只使用一种认证方式
type AuthConfig = MutuallyWithObject<NonNullable<APIConfig['auth']>>;
```

### 表单验证

```typescript
interface FormField {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

// 当设置 minLength 时，也应该考虑 maxLength
type LengthValidation = RequiredDependency<FormField, 'minLength', 'maxLength'>;
```

### 组件属性

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
}

// loading 和 disabled 互斥
type ButtonState = Mutually<ButtonProps, 'loading', 'disabled'>;
```
