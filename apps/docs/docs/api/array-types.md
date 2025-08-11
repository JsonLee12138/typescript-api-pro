---
sidebar_position: 3
---

# Array Type Utilities

Array type utilities provide tools for working with array types and extracting element information.

## Element Type Extraction

### ArrayItem

Extract the element type from an array type.

```typescript
type ArrayItem<T extends readonly unknown[]> = T extends readonly (infer U)[] ? U : never;

// Examples
type StringArray = string[];
type StringItem = ArrayItem<StringArray>; // string

type NumberArray = number[];
type NumberItem = ArrayItem<NumberArray>; // number

type MixedArray = (string | number | boolean)[];
type MixedItem = ArrayItem<MixedArray>; // string | number | boolean
```

## Tuple Type Handling

### Working with Tuples

`ArrayItem` works seamlessly with tuple types:

```typescript
type UserTuple = [string, number, boolean];
type UserTupleItem = ArrayItem<UserTuple>; // string | number | boolean

type CoordinateTuple = [number, number];
type CoordinateItem = ArrayItem<CoordinateTuple>; // number

type NamedTuple = [name: string, age: number, active: boolean];
type NamedTupleItem = ArrayItem<NamedTuple>; // string | number | boolean
```

## Readonly Array Support

### Readonly Arrays

The utility supports both mutable and readonly arrays:

```typescript
type ReadonlyStringArray = readonly string[];
type ReadonlyStringItem = ArrayItem<ReadonlyStringArray>; // string

type ReadonlyTuple = readonly [string, number];
type ReadonlyTupleItem = ArrayItem<ReadonlyTuple>; // string | number

// Const assertions create readonly tuples
const colors = ['red', 'green', 'blue'] as const;
type ColorsArray = typeof colors; // readonly ["red", "green", "blue"]
type ColorItem = ArrayItem<ColorsArray>; // "red" | "green" | "blue"
```

## Real-World Examples

### API Response Processing

```typescript
import type { ArrayItem } from 'typescript-api-pro';

interface User {
  id: number;
  name: string;
  email: string;
}

type UsersResponse = User[];
type SingleUser = ArrayItem<UsersResponse>; // User

// Function that processes individual users
function processUser(user: SingleUser) {
  console.log(`Processing user: ${user.name}`);
}

// Usage with array methods
const users: UsersResponse = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
];

users.forEach(processUser); // TypeScript knows the parameter type
```

### Generic Array Processing

```typescript
import type { ArrayItem } from 'typescript-api-pro';

// Generic function that works with any array type
function getFirstItem<T extends readonly unknown[]>(
  array: T
): ArrayItem<T> | undefined {
  return array[0] as ArrayItem<T> | undefined;
}

// Usage examples
const numbers = [1, 2, 3, 4, 5];
const firstNumber = getFirstItem(numbers); // number | undefined

const strings = ['hello', 'world'];
const firstString = getFirstItem(strings); // string | undefined

const mixed = [1, 'hello', true] as const;
const firstMixed = getFirstItem(mixed); // 1 | "hello" | true | undefined
```

### Form Field Arrays

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

// Validation function for individual fields
function validateField(field: SingleField): boolean {
  if (field.required && !field.name) {
    return false;
  }
  return true;
}

// Form configuration
const loginForm: FormFields = [
  { name: 'email', type: 'email', required: true, placeholder: 'Enter your email' },
  { name: 'password', type: 'password', required: true, placeholder: 'Enter your password' }
];

// Validate all fields
const isFormValid = loginForm.every(validateField);
```

### Event Handler Arrays

```typescript
import type { ArrayItem } from 'typescript-api-pro';

type EventHandler = (event: Event) => void;
type EventHandlers = EventHandler[];
type SingleHandler = ArrayItem<EventHandlers>; // EventHandler

// Event manager
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

### Configuration Arrays

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

// Connection pool manager
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

// Usage
const pool = new ConnectionPool();
pool.addConnection({
  host: 'localhost',
  port: 5432,
  database: 'users',
  ssl: true
});
```

## Type Safety Benefits

### Compile-Time Validation

```typescript
import type { ArrayItem } from 'typescript-api-pro';

// Type-safe array processing
function processItems<T extends readonly unknown[]>(
  items: T,
  processor: (item: ArrayItem<T>) => void
) {
  items.forEach(processor);
}

// Usage - TypeScript ensures type safety
const numbers = [1, 2, 3];
processItems(numbers, (num) => {
  console.log(num.toFixed(2)); // TypeScript knows num is number
});

const strings = ['a', 'b', 'c'];
processItems(strings, (str) => {
  console.log(str.toUpperCase()); // TypeScript knows str is string
});
```

### Integration with Other Utilities

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
