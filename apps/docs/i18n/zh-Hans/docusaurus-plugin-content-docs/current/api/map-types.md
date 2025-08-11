---
sidebar_position: 4
---

# Map 类型工具

Map 类型工具提供了强大的工具来处理 TypeScript Map 类型，提取键和值，以及在 Map 和对象之间进行转换。

## 键和值提取

### MapKeyOf

从 Map 类型中提取键类型。

```typescript
type MapKeyOf<T extends Map<unknown, unknown>> = T extends Map<infer K, unknown> ? K : never;

// 示例
type StringNumberMap = Map<string, number>;
type MapKeys = MapKeyOf<StringNumberMap>; // string

type UserIdMap = Map<'user' | 'admin' | 'guest', User>;
type UserKeys = MapKeyOf<UserIdMap>; // 'user' | 'admin' | 'guest'
```

### MapValueOf

从 Map 类型中提取值类型。

```typescript
type MapValueOf<T extends Map<unknown, unknown>> = T extends Map<unknown, infer V> ? V : never;

// 示例
type StringNumberMap = Map<string, number>;
type MapValues = MapValueOf<StringNumberMap>; // number

type UserRoleMap = Map<string, 'admin' | 'user' | 'guest'>;
type RoleValues = MapValueOf<UserRoleMap>; // 'admin' | 'user' | 'guest'
```

## Map 操作

### OmitMapKey

创建一个排除指定键的新 Map 类型。

```typescript
type OmitMapKey<T extends Map<unknown, unknown>, K extends MapKeyOf<T>>
  = T extends Map<infer Keys, infer V> ? Map<Exclude<Keys, K>, V> : never;

// 示例
type FullConfigMap = Map<'host' | 'port' | 'password' | 'ssl', string>;
type PublicConfigMap = OmitMapKey<FullConfigMap, 'password'>;
// 结果: Map<'host' | 'port' | 'ssl', string>
```

### PickMapKey

创建一个只包含指定键的新 Map 类型。

```typescript
type PickMapKey<T extends Map<unknown, unknown>, K extends MapKeyOf<T>>
  = T extends Map<unknown, infer V> ? Map<K, V> : never;

// 示例
type FullConfigMap = Map<'host' | 'port' | 'password' | 'ssl', string>;
type ConnectionConfigMap = PickMapKey<FullConfigMap, 'host' | 'port'>;
// 结果: Map<'host' | 'port', string>
```

## 类型转换

### MapToObject

将 Map 类型转换为对象类型。

```typescript
type MapToObject<T extends Map<PropertyKey, unknown>>
  = T extends Map<infer K, infer V> ? Record<K & PropertyKey, V> : never;

// 示例
type ConfigMap = Map<'host' | 'port', string>;
type ConfigObject = MapToObject<ConfigMap>;
// 结果: { host: string; port: string; }

type StatusMap = Map<'loading' | 'success' | 'error', boolean>;
type StatusObject = MapToObject<StatusMap>;
// 结果: { loading: boolean; success: boolean; error: boolean; }
```

### ObjectToMap

将对象类型转换为 Map 类型。

```typescript
type ObjectToMap<T extends Record<PropertyKey, unknown>> = Map<keyof T, T[keyof T]>;

// 示例
interface UserConfig {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

type UserConfigMap = ObjectToMap<UserConfig>;
// 结果: Map<'theme' | 'language' | 'notifications', 'light' | 'dark' | string | boolean>
```

## 实际应用示例

### 配置管理

```typescript
import type { MapKeyOf, MapToObject, MapValueOf, OmitMapKey } from 'typescript-api-pro';

// 数据库配置作为 Map
type DatabaseConfigMap = Map<
  'host' | 'port' | 'database' | 'username' | 'password' | 'ssl',
  string | number | boolean
>;

// 提取键和值类型
type ConfigKeys = MapKeyOf<DatabaseConfigMap>; // 'host' | 'port' | 'database' | 'username' | 'password' | 'ssl'
type ConfigValues = MapValueOf<DatabaseConfigMap>; // string | number | boolean

// 创建公共配置（不包含敏感数据）
type PublicConfigMap = OmitMapKey<DatabaseConfigMap, 'password' | 'username'>;

// 转换为对象用于 JSON 序列化
type PublicConfigObject = MapToObject<PublicConfigMap>;

// 配置管理器
class ConfigManager {
  private config: Map<ConfigKeys, ConfigValues> = new Map();

  set<K extends ConfigKeys>(key: K, value: ConfigValues): void {
    this.config.set(key, value);
  }

  get<K extends ConfigKeys>(key: K): ConfigValues | undefined {
    return this.config.get(key);
  }

  getPublicConfig(): PublicConfigObject {
    const publicMap = new Map(this.config);
    publicMap.delete('password');
    publicMap.delete('username');
    return Object.fromEntries(publicMap) as PublicConfigObject;
  }
}
```

### 缓存系统

```typescript
import type { MapKeyOf, MapValueOf, PickMapKey } from 'typescript-api-pro';

// 不同类型的缓存条目
type CacheMap = Map<
  'user:123' | 'post:456' | 'settings:global',
  User | Post | Settings
>;

type CacheKeys = MapKeyOf<CacheMap>; // 'user:123' | 'post:456' | 'settings:global'
type CacheValues = MapValueOf<CacheMap>; // User | Post | Settings

// 用户特定缓存
type UserCacheMap = PickMapKey<CacheMap, 'user:123'>;

// 具有类型安全的缓存管理器
class TypedCache {
  private cache: Map<CacheKeys, CacheValues> = new Map();

  set<K extends CacheKeys>(
    key: K,
    value: CacheValues
  ): void {
    this.cache.set(key, value);
  }

  get<K extends CacheKeys>(key: K): CacheValues | undefined {
    return this.cache.get(key);
  }

  has(key: CacheKeys): boolean {
    return this.cache.has(key);
  }

  delete(key: CacheKeys): boolean {
    return this.cache.delete(key);
  }
}
```

### 状态管理

```typescript
import type { MapToObject, ObjectToMap } from 'typescript-api-pro';

// 应用状态作为对象
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  language: string;
  isLoading: boolean;
}

// 转换为 Map 以便高效更新
type AppStateMap = ObjectToMap<AppState>;

// 状态管理器
class StateManager {
  private state: AppStateMap = new Map();

  // 初始化状态
  constructor(initialState: AppState) {
    Object.entries(initialState).forEach(([key, value]) => {
      this.state.set(key as keyof AppState, value);
    });
  }

  // 更新单个状态属性
  setState<K extends keyof AppState>(key: K, value: AppState[K]): void {
    this.state.set(key, value);
  }

  // 获取单个状态属性
  getState<K extends keyof AppState>(key: K): AppState[K] | undefined {
    return this.state.get(key) as AppState[K] | undefined;
  }

  // 获取整个状态作为对象
  getAllState(): AppState {
    return Object.fromEntries(this.state) as AppState;
  }

  // 订阅状态变化
  subscribe(callback: (state: AppState) => void): () => void {
    // 实现将包含实际的订阅逻辑
    return () => {}; // 取消订阅函数
  }
}
```

## 类型安全优势

### 编译时验证

```typescript
import type { MapKeyOf, MapValueOf } from 'typescript-api-pro';

// 类型安全的 Map 操作
function processMapEntries<T extends Map<unknown, unknown>>(
  map: T,
  processor: (key: MapKeyOf<T>, value: MapValueOf<T>) => void
): void {
  map.forEach((value, key) => {
    processor(key as MapKeyOf<T>, value as MapValueOf<T>);
  });
}

// 使用示例 - TypeScript 确保类型安全
const userRoles = new Map([
  ['admin', { permissions: ['read', 'write', 'delete'] }],
  ['user', { permissions: ['read'] }]
] as const);

processMapEntries(userRoles, (role, config) => {
  console.log(`角色 ${role} 拥有权限:`, config.permissions);
  // TypeScript 知道 role 和 config 的确切类型
});
```
