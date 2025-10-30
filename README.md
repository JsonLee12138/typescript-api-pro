# Typescript API 参考
[English Document](https://github.com/JsonLee12138/typescript-api-pro/blob/main/README.en.md)

## 📚 类型工具库

TypeScript API Pro 提供了一套完整的类型工具，按功能分为以下几类：

- [Object Types](#object-types) - 对象类型工具
- [Array Types](#array-types) - 数组类型工具
- [Map Types](#map-types) - Map 类型工具
- [Set Types](#set-types) - Set 类型工具
- [String Types](#string-types) - 字符串类型工具

## Object Types

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
type Generic<R extends AnyObject, K extends keyof R, T> = Omit<R, K> & { [P in K]: T };
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

### OmitByObject<T, U>
从类型 T 中排除所有与类型 U 有相同键名的属性。

```typescript
type OmitByObject<T, U> = Pick<T, Exclude<keyof T, keyof U>>
```

#### Type Parameters
- `T`: 源对象类型
- `U`: 包含要排除键的对象类型

#### Description
- 根据另一个对象类型的键来排除源对象中的属性
- 比标准的 `Omit` 更灵活，可以基于整个对象类型的结构来排除属性
- 适用于需要从一个对象中剔除另一个对象结构的场景

#### Example
```typescript
interface Person {
  name: string;
  age: number;
  address: string;
  phone: string;
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

// 创建一个不包含联系信息字段的个人信息类型
type PersonalInfoOnly = OmitByObject<Person, ContactInfo>;

// 等价于 { name: string; age: number; }
const personalInfo: PersonalInfoOnly = {
  name: '张三',
  age: 30
  // address 和 phone 属性已被排除，因为它们在 ContactInfo 中存在
};

// 另一个例子：排除通用元数据字段
interface WithMetadata {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Product extends WithMetadata {
  name: string;
  price: number;
  description: string;
}

// 只获取产品业务数据，不含元数据
type ProductData = OmitByObject<Product, WithMetadata>;

// 等价于 { name: string; price: number; description: string; }
const productData: ProductData = {
  name: '智能手机',
  price: 3999,
  description: '最新款智能手机'
  // id、createdAt 和 updatedAt 已被排除
};
```

## Array Types

### ArrayItem<T>
从数组类型中提取元素类型的工具类型。

```typescript
export type ArrayItem<T extends any[]> = T[number];
```

#### Type Parameters
- `T`: 任意数组类型

#### Description
- 使用索引访问类型 `T[number]` 从数组类型中提取元素类型
- 可用于获取数组、元组或只读数组的元素类型
- 在处理泛型数组时特别有用,可以保留元素的具体类型信息

#### Example
```typescript
// 简单数组类型
type NumberArray = number[];
type NumberItem = ArrayItem<NumberArray>; // number

// 对象数组
interface User {
  id: number;
  name: string;
}
type UserArray = User[];
type UserItem = ArrayItem<UserArray>; // User

// 元组类型
type Tuple = [string, number, boolean];
type TupleItem = ArrayItem<Tuple>; // string | number | boolean

// 实际使用示例
const users: User[] = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' }
];

// 使用 ArrayItem 获取数组元素类型
function processUser(user: ArrayItem<typeof users>) {
  console.log(`处理用户: ${user.name}, ID: ${user.id}`);
}

// 可以直接传入数组元素
processUser(users[0]); // 正确: 类型匹配
```

### ValueOf<T>
从对象类型中提取所有属性值的联合类型。

```typescript
type ValueOf<T> = T[keyof T];
```

#### Type Parameters
- `T`: 任意对象类型

#### Description
- 获取对象所有属性值的联合类型
- 常用于类型映射、类型推导等场景

#### Example
```typescript
interface StatusMap {
  success: 200;
  notFound: 404;
  error: 500;
}
type StatusCode = ValueOf<StatusMap>; // 200 | 404 | 500
```

### KeyOf<T>
获取对象所有属性键的联合类型。

```typescript
type KeyOf<T> = keyof T;
```

#### Type Parameters
- `T`: 任意对象类型

#### Description
- 等价于 TypeScript 内置的 `keyof` 操作符
- 用于获取对象所有属性名的联合类型

#### Example
```typescript
interface User {
  id: number;
  name: string;
  age: number;
}
type UserKeys = KeyOf<User>; // "id" | "name" | "age"
```

## Map Types

### MapKeyOf<T>
从 Map 类型中提取键类型。

```typescript
type MapKeyOf<T extends Map<unknown, unknown>> = T extends Map<infer K, unknown> ? K : never;
```

#### Type Parameters
- `T` : 任意 Map 类型

#### Description
- 使用条件类型和 infer 关键字从 Map 类型中提取键的类型
- 返回 Map 中所有可能键的联合类型
- 如果传入的不是 Map 类型，则返回 `never`

#### Example
```typescript
// 基础用法
type StringNumberMap = Map<string, number>;
type Keys = MapKeyOf<StringNumberMap>; // string

// 联合键类型
type UnionKeyMap = Map<string | number, boolean>;
type UnionKeys = MapKeyOf<UnionKeyMap>; // string | number

// 字面量键类型
type LiteralMap = Map<'name' | 'age', string>;
type LiteralKeys = MapKeyOf<LiteralMap>; // 'name' | 'age'
```

### MapValueOf<T>
从 Map 类型中提取值类型。

```typescript
type MapValueOf<T extends Map<unknown, unknown>> = T extends Map<unknown, infer V> ? V : never;
```

#### Type Parameters
- `T` : 任意 Map 类型

#### Description
- 从 Map 类型中提取值的类型
- 返回 Map 中所有可能值的联合类型

#### Example
```typescript
// 基础用法
type StringNumberMap = Map<string, number>;
type Values = MapValueOf<StringNumberMap>; // number

// 联合值类型
type UnionValueMap = Map<string, number | boolean>;
type UnionValues = MapValueOf<UnionValueMap>; // number | boolean

// 对象值类型
interface User {
  id: number;
  name: string;
}
type UserMap = Map<string, User>;
type UserValue = MapValueOf<UserMap>; // User
```

### MapToObject<T>
将 Map 类型转换为对象类型。

```typescript
type MapToObject<T extends Map<unknown, unknown>> = {
    [K in MapKeyOf<T> & PropertyKey]: T extends Map<unknown, infer V> ? V : never;
}
```

#### Type Parameters
- `T` : 任意 Map 类型

#### Description
- 将 Map 类型转换为等价的对象类型
- 只有当 Map 的键类型是 PropertyKey`（string | number | symbol）`的子集时才能正确转换
- 保持键值对应关系不变

#### Example
```typescript
// 字符串键的 Map
type StringMap = Map<'name' | 'age', string>;
type StringObject = MapToObject<StringMap>;
// { name: string; age: string; }

// 数字键的 Map
type NumberMap = Map<1 | 2 | 3, boolean>;
type NumberObject = MapToObject<NumberMap>;
// { 1: boolean; 2: boolean; 3: boolean; }

// 实际使用示例
const userMap: Map<'id' | 'name', string> = new Map([
  ['id', '123'],
  ['name', '张三']
]);

// 转换后的对象类型
type UserObject = MapToObject<typeof userMap>;
// { id: string; name: string; }
```

### ObjectToMap<T>
将对象型转换为Map类型。

```typescript
type ObjectToMap<T extends AnyObject> = Map<keyof T, T[keyof T]>;
```

#### Type Parameters
- `T` : 任意继承自 `AnyObject` 的对象类型

#### Description
- 将对象类型转换为等价的 Map 类型
- 对象的键成为 Map 的键类型，对象的值成为 Map 的值类型

#### Example
```typescript
// 基础对象转换
interface User {
  id: number;
  name: string;
  active: boolean;
}
type UserMap = ObjectToMap<User>;
// Map<'id' | 'name' | 'active', number | string | boolean>

// 配置对象转换
interface Config {
  host: string;
  port: number;
  ssl: boolean;
}
type ConfigMap = ObjectToMap<Config>;
// Map<'host' | 'port' | 'ssl', string | number | boolean>
```
### OmitMapKey<T, K>
从 Map 类型中排除指定键的。

```typescript
type OmitMapKey<T extends Map<unknown, unknown>, K extends MapKeyOf<T>> =
  T extends Map<infer Keys, infer V> ? Map<Exclude<Keys, K>, V> : never;
```

#### Type Parameters
- `T` : 继承自 AnyObject 的对象类型
- `K` : 要排除的键，必须是 T 中存在的键类型

#### Description
- 创建一个新的 Map 类型，排除指定的键
- 保持值类型不变，只移除指定的键类型
- 类似于对象类型的 Omit 工具类型

#### Example
```typescript
// 排除单个键
type OriginalMap = Map<'name' | 'age' | 'email', string>;
type WithoutEmail = OmitMapKey<OriginalMap, 'email'>;
// Map<'name' | 'age', string>

// 排除多个键（使用联合类型）
type WithoutNameAndAge = OmitMapKey<OriginalMap, 'name' | 'age'>;
// Map<'email', string>
```

### PickMapKey<T, K>
从 Map 类型中选择指定键的。

```typescript
export type PickMapKey<T extends Map<unknown, unknown>, K extends MapKeyOf<T>> =
  T extends Map<unknown, infer V> ? Map<K, V> : never;
```

#### Type Parameters
- `T` : 继承自 `AnyObject` 的对象类型
- `K` : 要排除的键，必须是 `T` 中存在的键类型

#### Description
- 创建一个新的 Map 类型，只包含指定的键
- 保持值类型不变，只保留指定的键类型
- 类似于对象类型的 Pick 工具类型

#### Example
```typescript
// 选择单个键
type OriginalMap = Map<'name' | 'age' | 'email', string>;
type OnlyName = PickMapKey<OriginalMap, 'name'>;
// Map<'name', string>

// 选择多个键
type NameAndAge = PickMapKey<OriginalMap, 'name' | 'age'>;
// Map<'name' | 'age', string>
```

## Set Types

### SetValueOf<T>
从 Set 类型中提取元素类型。

```typescript
type SetValueOf<T extends ReadonlySet<unknown>> =
  T extends ReadonlySet<infer V> ? V : never;
```

#### Type Parameters
- `T` : 任意 Set 类型

#### Description
- 使用条件类型和 infer 关键字从 Set 类型中提取元素类型
- 返回 Set 中所有可能元素的联合类型
- 如果传入的不是 Set 类型，则返回 never

#### Example
```typescript
// 基础用法
type StringSet = Set<string>;
type StringElement = SetValueOf<StringSet>; // string

// 联合类型元素
type MixedSet = Set<string | number | boolean>;
type MixedElement = SetValueOf<MixedSet>; // string | number | boolean

// 字面量类型元素
type LiteralSet = Set<'red' | 'green' | 'blue'>;
type ColorElement = SetValueOf<LiteralSet>; // 'red' | 'green' | 'blue'

// 对象类型元素
interface User {
  id: number;
  name: string;
}
type UserSet = Set<User>;
type UserElement = SetValueOf<UserSet>; // User
```

### OmitSetValue<T, V>
从 Set 类型中排除指定值的。

```typescript
type OmitSetValue<T extends Set<unknown>, V extends SetValueOf<T>> =
  T extends Set<infer Values> ? Set<Exclude<Values, V>> : never;
```

#### Type Parameters
- `T` : 任意 Set 类型
- `V` : 要排除的值，必须是 T 中存在的元素类型

#### Description
- 创建一个新的 Set 类型，排除指定的元素类型
- 使用 Exclude 工具类型从联合类型中移除指定类型
- 适用于需要从 Set 中移除特定元素类型的场景

#### Example
```typescript
// 排除单个值类型
type OriginalSet = Set<'apple' | 'banana' | 'orange'>;
type WithoutApple = OmitSetValue<OriginalSet, 'apple'>;
// Set<'banana' | 'orange'>

// 排除多个值类型
type WithoutFruits = OmitSetValue<OriginalSet, 'apple' | 'banana'>;
// Set<'orange'>

// 数字类型示例
type NumberSet = Set<1 | 2 | 3 | 4 | 5>;
type WithoutOddNumbers = OmitSetValue<NumberSet, 1 | 3 | 5>;
// Set<2 | 4>
```

### PickSetValue<T, V>
从 Set 类型中选择指定值的。

```typescript
type PickSetValue<T extends Set<unknown>, V extends SetValueOf<T>> = Set<V>;
```

#### Type Parameters
- `T` : 任意 Set 类型
- `V` : 要排除的值，必须是 T 中存在的元素类型

#### Description
- 创建一个新的 Set 类型，只包含指定的元素类型
- 直接使用指定的值类型创建新的 Set
- 适用于需要从 Set 中提取特定元素类型的场景

#### Example
```typescript
// 选择单个值类型
type OriginalSet = Set<'red' | 'green' | 'blue' | 'yellow'>;
type PrimaryColors = PickSetValue<OriginalSet, 'red' | 'green' | 'blue'>;
// Set<'red' | 'green' | 'blue'>

// 选择数字类型
type NumberSet = Set<1 | 2 | 3 | 4 | 5>;
type EvenNumbers = PickSetValue<NumberSet, 2 | 4>;
// Set<2 | 4>
```

### ArrayToSet<T>
将数组类型转换为 Set 类型的。

```typescript
type ArrayToSet<T extends readonly unknown[]> = Set<T[number]>;
```

#### Type Parameters
- `T` : 任意数组类型

#### Description
- 将数组类型转换为等价的 Set 类型
- 使用索引访问类型 `T[number]` 获取数组元素类型
- Set 会自动去重，所以重复的元素类型只会出现一次

#### Example
```typescript
// 基础数组转换
type StringArray = string[];
type StringSet = ArrayToSet<StringArray>; // Set<string>

// 元组转换
type ColorTuple = ['red', 'green', 'blue', 'red'];
type ColorSet = ArrayToSet<ColorTuple>; // Set<'red' | 'green' | 'blue'>

// 联合类型数组
type MixedArray = (string | number)[];
type MixedSet = ArrayToSet<MixedArray>; // Set<string | number>

// 实际使用示例
const fruits = ['apple', 'banana', 'apple', 'orange'] as const;
type FruitSet = ArrayToSet<typeof fruits>;
// Set<'apple' | 'banana' | 'orange'>
```

### SetToArray<T>
将 Set 类型转换为数组类型的。

```typescript
type SetToArray<T extends ReadonlySet<unknown>> = SetValueOf<T>[];
```

#### Type Parameters
- `T` : 任意数组类型

#### Description
- 将 Set 类型转换为等价的数组类型
- 使用 SetValueOf 提取 Set 的元素类型，然后创建数组类型

#### Example
```typescript
// 基础 Set 转换
type StringSet = Set<string>;
type StringArray = SetToArray<StringSet>; // string[]

// 字面量 Set 转换
type ColorSet = Set<'red' | 'green' | 'blue'>;
type ColorArray = SetToArray<ColorSet>; // ('red' | 'green' | 'blue')[]

// 对象 Set 转换
interface User {
  id: number;
  name: string;
}
type UserSet = Set<User>;
type UserArray = SetToArray<UserSet>; // User[]

// 实际使用示例
function convertSetToArray<T extends Set<any>>(set: T): SetToArray<T> {
  return Array.from(set) as SetToArray<T>;
}
```

## String Types

### Camel2SnakeCase<T, U>
将驼峰命名字符串转换为蛇形命名格式。

```typescript
type Camel2SnakeCase<T extends string, U extends boolean = true> = /* ... */
```

#### Type Parameters
- `T` : 要转换的驼峰命名字符串
- `U` : 是否使用大写（默认：`true`）

#### Description
- 将驼峰命名（camelCase）转换为蛇形命名（snake_case）
- 可选择转换为大写蛇形命名（UPPER_SNAKE_CASE）或小写蛇形命名（lower_snake_case）
- 在类型级别进行转换，零运行时开销
- 适用于 API 请求/响应、数据库字段、环境变量等命名转换场景

#### Example
```typescript
// 转换为大写蛇形命名（默认）
type Result1 = Camel2SnakeCase<'userName'>; // 'USER_NAME'
type Result2 = Camel2SnakeCase<'userId'>; // 'USER_ID'
type Result3 = Camel2SnakeCase<'myVariableName'>; // 'MY_VARIABLE_NAME'

// 转换为小写蛇形命名
type Result4 = Camel2SnakeCase<'userName', false>; // 'user_name'
type Result5 = Camel2SnakeCase<'userId', false>; // 'user_id'
type Result6 = Camel2SnakeCase<'myVariableName', false>; // 'my_variable_name'

// 实际应用：API 请求对象转换
interface UserRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
}

// 转换为后端 API 格式（大写蛇形命名）
type ApiUserRequest = {
  [K in keyof UserRequest as Camel2SnakeCase<K & string>]: UserRequest[K]
};
// 结果：{ FIRST_NAME: string; LAST_NAME: string; EMAIL_ADDRESS: string; }

// 转换为数据库字段格式（小写蛇形命名）
type DbUserModel = {
  [K in keyof UserRequest as Camel2SnakeCase<K & string, false>]: UserRequest[K]
};
// 结果：{ first_name: string; last_name: string; email_address: string; }

// 环境变量配置
interface AppConfig {
  databaseUrl: string;
  apiKey: string;
  maxConnections: number;
}

type EnvVars = {
  [K in keyof AppConfig as Camel2SnakeCase<K & string>]: string
};
// 结果：{ DATABASE_URL: string; API_KEY: string; MAX_CONNECTIONS: string; }

// 类型安全的转换函数
function toSnakeCase<T extends Record<string, unknown>>(
  obj: T,
  uppercase = false
): { [K in keyof T as Camel2SnakeCase<K & string, false>]: T[K] } {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter =>
      `_${uppercase ? letter : letter.toLowerCase()}`
    );
    result[snakeKey] = obj[key];
  }

  return result as { [K in keyof T as Camel2SnakeCase<K & string, false>]: T[K] };
}

const userData: UserRequest = {
  firstName: '张三',
  lastName: '李',
  emailAddress: 'zhangsan@example.com'
};

const dbRecord = toSnakeCase(userData);
// TypeScript 确保类型安全
console.log(dbRecord.first_name); // ✅ 正确
// console.log(dbRecord.firstName); // ❌ 错误：属性不存在
```

## 📝 贡献指南
欢迎提交`issue`或`pull request`，共同完善`Hook-Fetch`。

## 📄 许可证

MIT

## 联系我们

- [Discord](https://discord.gg/Ah55KD5d)
