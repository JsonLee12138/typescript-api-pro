---
sidebar_position: 3
---

# 数组类型工具

数组类型工具提供了处理数组类型和提取元素信息的工具。

## 元素类型提取

### ArrayItem

从数组类型中提取元素类型。

```typescript
type ArrayItem<T extends readonly unknown[]> = T extends readonly (infer U)[] ? U : never;

// 示例
type StringArray = string[];
type StringItem = ArrayItem<StringArray>; // string

type NumberArray = number[];
type NumberItem = ArrayItem<NumberArray>; // number

type MixedArray = (string | number | boolean)[];
type MixedItem = ArrayItem<MixedArray>; // string | number | boolean
```

## 元组类型处理

### 处理元组

`ArrayItem` 可以无缝处理元组类型：

```typescript
type UserTuple = [string, number, boolean];
type UserTupleItem = ArrayItem<UserTuple>; // string | number | boolean

type CoordinateTuple = [number, number];
type CoordinateItem = ArrayItem<CoordinateTuple>; // number

type NamedTuple = [name: string, age: number, active: boolean];
type NamedTupleItem = ArrayItem<NamedTuple>; // string | number | boolean
```

## 只读数组支持

### 只读数组

该工具支持可变和只读数组：

```typescript
type ReadonlyStringArray = readonly string[];
type ReadonlyStringItem = ArrayItem<ReadonlyStringArray>; // string

type ReadonlyTuple = readonly [string, number];
type ReadonlyTupleItem = ArrayItem<ReadonlyTuple>; // string | number

// const 断言创建只读元组
const colors = ['red', 'green', 'blue'] as const;
type ColorsArray = typeof colors; // readonly ["red", "green", "blue"]
type ColorItem = ArrayItem<ColorsArray>; // "red" | "green" | "blue"
```

## 实际应用示例

### API 响应处理

```typescript
import type { ArrayItem } from 'typescript-api-pro';

interface User {
  id: number;
  name: string;
  email: string;
}

type UsersResponse = User[];
type SingleUser = ArrayItem<UsersResponse>; // User

// 处理单个用户的函数
function processUser(user: SingleUser) {
  console.log(`处理用户: ${user.name}`);
}

// 与数组方法一起使用
const users: UsersResponse = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
];

users.forEach(processUser); // TypeScript 知道参数类型
```

### 通用数组处理

```typescript
import type { ArrayItem } from 'typescript-api-pro';

// 适用于任何数组类型的通用函数
function getFirstItem<T extends readonly unknown[]>(
  array: T
): ArrayItem<T> | undefined {
  return array[0] as ArrayItem<T> | undefined;
}

// 使用示例
const numbers = [1, 2, 3, 4, 5];
const firstNumber = getFirstItem(numbers); // number | undefined

const strings = ['hello', 'world'];
const firstString = getFirstItem(strings); // string | undefined

const mixed = [1, 'hello', true] as const;
const firstMixed = getFirstItem(mixed); // 1 | "hello" | true | undefined
```

### 表单字段数组

```typescript
import type { ArrayItem } from 'typescript-api-pro';

interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number';
  required: boolean;
  placeholder?: string;
}

type FormFields = FormField[];
type SingleField = ArrayItem<FormFields>; // FormField

// 单个字段的验证函数
function validateField(field: SingleField): boolean {
  if (field.required && !field.name) {
    return false;
  }
  return true;
}

// 表单配置
const loginForm: FormFields = [
  { name: 'email', type: 'email', required: true, placeholder: '输入您的邮箱' },
  { name: 'password', type: 'password', required: true, placeholder: '输入您的密码' }
];

// 验证所有字段
const isFormValid = loginForm.every(validateField);
```

### 事件处理器数组

```typescript
import type { ArrayItem } from 'typescript-api-pro';

type EventHandler = (event: Event) => void;
type EventHandlers = EventHandler[];
type SingleHandler = ArrayItem<EventHandlers>; // EventHandler

// 事件管理器
class EventManager {
  private handlers: EventHandlers = [];

  addHandler(handler: SingleHandler) {
    this.handlers.push(handler);
  }

  removeHandler(handler: SingleHandler) {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }

  trigger(event: Event) {
    this.handlers.forEach(handler => handler(event));
  }
}
```

### 配置数组

```typescript
import type { ArrayItem } from 'typescript-api-pro';

interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  ssl?: boolean;
}

type DatabaseConnections = DatabaseConnection[];
type SingleConnection = ArrayItem<DatabaseConnections>; // DatabaseConnection

// 连接池管理器
class ConnectionPool {
  private connections: DatabaseConnections = [];

  addConnection(connection: SingleConnection) {
    this.connections.push(connection);
  }

  getConnection(database: string): SingleConnection | undefined {
    return this.connections.find(conn => conn.database === database);
  }

  getAllConnections(): DatabaseConnections {
    return [...this.connections];
  }
}

// 使用示例
const pool = new ConnectionPool();
pool.addConnection({
  host: 'localhost',
  port: 5432,
  database: 'users',
  ssl: true
});
```

## 类型安全优势

### 编译时验证

```typescript
import type { ArrayItem } from 'typescript-api-pro';

// 类型安全的数组处理
function processItems<T extends readonly unknown[]>(
  items: T,
  processor: (item: ArrayItem<T>) => void
) {
  items.forEach(processor);
}

// 使用示例 - TypeScript 确保类型安全
const numbers = [1, 2, 3];
processItems(numbers, (num) => {
  console.log(num.toFixed(2)); // TypeScript 知道 num 是 number
});

const strings = ['a', 'b', 'c'];
processItems(strings, (str) => {
  console.log(str.toUpperCase()); // TypeScript 知道 str 是 string
});
```

### 与其他工具集成

```typescript
import type { ArrayItem, ValueOf } from 'typescript-api-pro';

interface Product {
  id: number;
  name: string;
  price: number;
  categories: string[];
}

type Products = Product[];
type SingleProduct = ArrayItem<Products>; // Product
type ProductValue = ValueOf<SingleProduct>; // number | string | string[]
type ProductCategory = ArrayItem<SingleProduct['categories']>; // string
```
