# API Reference

## Types

### PropertyKey
用于表示对象属性键的联合类型。

```typescript
type PropertyKey = string | number | symbol;
```

#### Description
- 包含了 JavaScript 中所有可能的对象属性键类型
- 等同于 TypeScript 内置的 `PropertyKey` 类型

#### Example
```typescript
const strKey: PropertyKey = 'name';     // string key
const numKey: PropertyKey = 42;         // number key
const symKey: PropertyKey = Symbol();   // symbol key
```

### AnyObject<T = any>
创建一个键为 `PropertyKey`，值类型为泛型 `T` 的对象类型。

```typescript
type AnyObject<T = any> = Record<PropertyKey, T>;
```

#### Description
- 泛型参数 `T` 定义对象值的类型，默认为 `any`
- 对象的键可以是任意 `PropertyKey` 类型

#### Example
```typescript
// 所有值都是字符串的对象
const strObject: AnyObject<string> = {
  name: 'John',
  1: 'One',
  [Symbol('key')]: 'Symbol value'
};

// 所有值都是数字的对象
const numObject: AnyObject<number> = {
  count: 42,
  1: 123,
  [Symbol('key')]: 456
};
```

### RequiredDependency<T, K, D>
创建一个类型，其中某些属性必须同时存在或同时不存在。

```typescript
type RequiredDependency<T, K extends keyof T, D extends keyof T> = 
  Omit<T, D> & (Partial<{ [P in K | D]: never }> | Required<Pick<T, K | D>>);
```

#### Type Parameters
- `T`: 基础对象类型
- `K`: 键属性（key property）
- `D`: 依赖属性（dependent property）

#### Description
- 确保当存在键属性 `K` 时，依赖属性 `D` 必须同时存在
- 如果不提供键属性 `K`，则依赖属性 `D` 也不能提供
- 用于处理属性之间的依赖关系

#### Example
```typescript
interface Config {
  name: string;
  host?: string;
  port?: number;
}

// 创建一个类型，要求 host 和 port 必须同时存在或同时不存在
type ServerConfig = RequiredDependency<Config, 'host', 'port'>;

// ✅ 正确：同时提供 host 和 port
const config1: ServerConfig = {
  name: 'server1',
  host: 'localhost',
  port: 8080
};

// ✅ 正确：同时不提供 host 和 port
const config2: ServerConfig = {
  name: 'server2'
};

// ❌ 错误：不能只提供 host 而不提供 port
const config3: ServerConfig = {
  name: 'server3',
  host: 'localhost'  // Error
};

// ❌ 错误：不能只提供 port 而不提供 host
const config4: ServerConfig = {
  name: 'server4',
  port: 8080  // Error
};
```