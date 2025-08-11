---
sidebar_position: 1
---

# API 概览

TypeScript API Pro 提供了丰富的类型工具集，分为四个主要模块：

## 📦 模块结构

```
typescript-api-pro/
├── object/     # 对象类型工具
├── array/      # 数组类型工具
├── map/        # Map 类型工具
└── set/        # Set 类型工具
```

## 🔧 核心类型

### 基础类型

- [`PropertyKey`](../object-types#propertykey) - 对象属性键类型
- [`AnyObject<T>`](../object-types#anyobject) - 通用对象类型

### 对象操作

- [`ValueOf<T>`](../object-types#valueof) - 提取对象值类型
- [`KeyOf<T>`](../object-types#keyof) - 提取对象键类型
- [`Generic<R, K, T>`](../object-types#generic) - 覆盖对象属性类型
- [`OmitByObject<T, U>`](../object-types#omitbyobject) - 基于对象结构排除属性

### 依赖关系

- [`RequiredDependency<T, K, D>`](../object-types#requireddependency) - 属性依赖关系
- [`MutuallyWithObject<T>`](../object-types#mutuallywithobject) - 互斥对象属性
- [`Mutually<T, K, O>`](../object-types#mutually) - 双属性互斥

### 数组操作

- [`ArrayItem<T>`](../array-types#arrayitem) - 提取数组元素类型

### Map 操作

- [`MapKeyOf<T>`](../map-types#mapkeyof) - 提取 Map 键类型
- [`MapValueOf<T>`](../map-types#mapvalueof) - 提取 Map 值类型
- [`MapToObject<T>`](../map-types#maptoobject) - Map 转对象
- [`ObjectToMap<T>`](../map-types#objecttomap) - 对象转 Map
- [`OmitMapKey<T, K>`](../map-types#omitmapkey) - 排除 Map 键
- [`PickMapKey<T, K>`](../map-types#pickmapkey) - 选择 Map 键

### Set 操作

- [`SetValueOf<T>`](../set-types#setvalueof) - 提取 Set 元素类型
- [`OmitSetValue<T, V>`](../set-types#omitsetvalue) - 排除 Set 值
- [`PickSetValue<T, V>`](../set-types#picksetvalue) - 选择 Set 值
- [`ArrayToSet<T>`](../set-types#arraytoset) - 数组转 Set
- [`SetToArray<T>`](../set-types#settoarray) - Set 转数组

## 🎯 使用场景

### 类型安全的配置对象

```typescript
import type { MutuallyWithObject, RequiredDependency } from 'typescript-api-pro';

interface DatabaseConfig {
  host?: string;
  port?: number;
  ssl?: boolean;
}

// 确保 host 和 port 同时存在或同时不存在
type SafeDatabaseConfig = RequiredDependency<DatabaseConfig, 'host', 'port'>;
```

### 互斥选项

```typescript
import type { MutuallyWithObject } from 'typescript-api-pro';

interface AuthOptions {
  token: string;
  username: string;
  apiKey: string;
}

// 只能选择一种认证方式
type AuthMethod = MutuallyWithObject<AuthOptions>;
```

### 集合类型转换

```typescript
import type { ArrayToSet, MapToObject, SetToArray } from 'typescript-api-pro';

// 数组转 Set（自动去重）
type UniqueColors = ArrayToSet<['red', 'blue', 'red', 'green']>; // Set<'red' | 'blue' | 'green'>

// Map 转对象
type ConfigObject = MapToObject<Map<'host' | 'port', string>>; // { host: string; port: string; }
```

## 📖 了解更多

选择特定的类型分类来了解更多详细信息和使用示例：

- [对象类型工具](../object-types)
- [数组类型工具](../array-types)
- [Map 类型工具](../map-types)
- [Set 类型工具](../set-types)
