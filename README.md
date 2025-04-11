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

### MutuallyWithObject<T>
创建一个互斥对象类型，其中只能包含基础类型 T 中的一个属性。

```typescript
type MutuallyWithObject<T extends AnyObject> = {
  [K in keyof T]: { [P in K]: T[K] } & { [P in Exclude<keyof T, K>]?: never };
}[keyof T]
```

#### Description
- 确保对象中只能存在一个指定属性
- 非常适合表示互斥选项的场景
- 每个属性的类型保持与原始类型 T 中相同

#### Example
```typescript
interface LoginOptions {
  username: string;
  email: string;
  phone: number;
}

// 创建一个类型，只允许使用三种登录方式中的一种
type LoginMethod = MutuallyWithObject<LoginOptions>;

// ✅ 正确：只使用用户名
const login1: LoginMethod = {
  username: 'user123'
};

// ✅ 正确：只使用邮箱
const login2: LoginMethod = {
  email: 'user@example.com'
};

// ✅ 正确：只使用手机号
const login3: LoginMethod = {
  phone: 13812345678
};

// ❌ 错误：不能同时提供多个属性
const login4: LoginMethod = {
  username: 'user123',
  email: 'user@example.com'  // Error
};
```

### Mutually<T, K, O>
创建一个联合类型，其中要么不包含 K 属性，要么不包含 O 属性。

```typescript
type Mutually<T extends AnyObject, K extends keyof T, O extends keyof T> = Omit<T, K> | Omit<T, O>;
```

#### Type Parameters
- `T`: 基础对象类型
- `K`: 第一个互斥属性
- `O`: 第二个互斥属性

#### Description
- 确保两个属性不能同时存在于对象中
- 与 MutuallyWithObject 不同，它允许其他属性同时存在
- 适合处理两个特定属性之间的互斥关系

#### Example
```typescript
interface FormData {
  name: string;
  age: number;
  personalId?: string;
  passportNumber?: string;
}

// 创建一个类型，身份证号和护照号互斥（只能提供其中一个）
type IdentityFormData = Mutually<FormData, 'personalId', 'passportNumber'>;

// ✅ 正确：提供身份证号，没有护照号
const data1: IdentityFormData = {
  name: '张三',
  age: 30,
  personalId: '110101199001011234'
};

// ✅ 正确：提供护照号，没有身份证号
const data2: IdentityFormData = {
  name: '李四',
  age: 25,
  passportNumber: 'G12345678'
};

// ✅ 正确：两个都不提供
const data3: IdentityFormData = {
  name: '王五',
  age: 40
};

// ❌ 错误：不能同时提供两个属性
const data4: IdentityFormData = {
  name: '赵六',
  age: 35,
  personalId: '110101199001011234',
  passportNumber: 'G12345678'  // Error
};
```

### Generic<R, K, T>
创建一个新类型，继承基础类型 R 的所有属性，但将某个特定属性 K 的类型重写为 T。

```typescript
type Generic<R extends AnyObject, K extends keyof R, T> = R & { [P in K]: T };
```

#### Type Parameters
- `R`: 基础对象类型
- `K`: 需要重写类型的属性键
- `T`: 新的属性类型

#### Description
- 保留原始类型的所有属性
- 仅替换指定属性的类型
- 适用于扩展或特化现有类型

#### Example
```typescript
interface User {
  id: number;
  name: string;
  roles: string[];
}

// 创建一个新类型，将 roles 属性的类型从 string[] 修改为更具体的 Role[] 类型
interface Role {
  id: number;
  name: string;
  permissions: string[];
}

type EnhancedUser = Generic<User, 'roles', Role[]>;

// ✅ 正确：roles 现在是 Role[] 类型
const user: EnhancedUser = {
  id: 1,
  name: '张三',
  roles: [
    { id: 1, name: 'admin', permissions: ['read', 'write', 'delete'] },
    { id: 2, name: 'editor', permissions: ['read', 'write'] }
  ]
};
```
