# API Reference

## Types

### PropertyKey
A union type representing all possible object property key types in JavaScript.

```typescript
type PropertyKey = string | number | symbol;
```

#### Description
- Includes all possible object property key types in JavaScript
- Equivalent to TypeScript's built-in `PropertyKey` type

#### Example
```typescript
const strKey: PropertyKey = 'name';     // string key
const numKey: PropertyKey = 42;         // number key
const symKey: PropertyKey = Symbol();   // symbol key
```

### AnyObject<T = any>
Creates an object type with keys of type `PropertyKey` and values of generic type `T`.

```typescript
type AnyObject<T = any> = Record<PropertyKey, T>;
```

#### Description
- Generic parameter `T` defines the type of object values, defaults to `any`
- Object keys can be any `PropertyKey` type
- Useful for defining objects with flexible key types but consistent value types

#### Example
```typescript
// Object with all string values
const strObject: AnyObject<string> = {
  name: 'John',
  1: 'One',
  [Symbol('key')]: 'Symbol value'
};

// Object with all number values
const numObject: AnyObject<number> = {
  count: 42,
  1: 123,
  [Symbol('key')]: 456
};
```

### RequiredDependency<T, K, D>
Creates a type where certain properties must either exist together or not exist at all.

```typescript
type RequiredDependency<T, K extends keyof T, D extends keyof T> =
  Omit<T, D> & (Partial<{ [P in K | D]: never }> | Required<Pick<T, K | D>>);
```

#### Type Parameters
- `T`: Base object type
- `K`: Key property
- `D`: Dependent property

#### Description
- Ensures that when key property `K` exists, dependent property `D` must also exist
- If key property `K` is not provided, dependent property `D` cannot be provided either
- Useful for handling property dependencies in configuration objects or API parameters

#### Example
```typescript
interface Config {
  name: string;
  host?: string;
  port?: number;
}

// Create a type where host and port must exist together or not at all
type ServerConfig = RequiredDependency<Config, 'host', 'port'>;

// ✅ Valid: both host and port are provided
const config1: ServerConfig = {
  name: 'server1',
  host: 'localhost',
  port: 8080
};

// ✅ Valid: neither host nor port is provided
const config2: ServerConfig = {
  name: 'server2'
};

// ❌ Invalid: cannot provide host without port
const config3: ServerConfig = {
  name: 'server3',
  host: 'localhost'  // Error
};

// ❌ Invalid: cannot provide port without host
const config4: ServerConfig = {
  name: 'server4',
  port: 8080  // Error
};
```

### MutuallyWithObject<T>
Creates a mutually exclusive object type where only one property from the base type T can be present.

```typescript
type MutuallyWithObject<T extends AnyObject> = {
  [K in keyof T]: { [P in K]: T[K] } & { [P in Exclude<keyof T, K>]?: never };
}[keyof T]
```

#### Description
- Ensures only one property from the specified set can exist in an object
- Perfect for representing mutually exclusive options
- Each property maintains its original type from T

#### Example
```typescript
interface LoginOptions {
  username: string;
  email: string;
  phone: number;
}

// Create a type that only allows one login method at a time
type LoginMethod = MutuallyWithObject<LoginOptions>;

// ✅ Valid: using only username
const login1: LoginMethod = {
  username: 'user123'
};

// ✅ Valid: using only email
const login2: LoginMethod = {
  email: 'user@example.com'
};

// ✅ Valid: using only phone
const login3: LoginMethod = {
  phone: 13812345678
};

// ❌ Invalid: cannot provide multiple properties
const login4: LoginMethod = {
  username: 'user123',
  email: 'user@example.com'  // Error
};
```

### Mutually<T, K, O>
Creates a union type where either property K is absent or property O is absent.

```typescript
type Mutually<T extends AnyObject, K extends keyof T, O extends keyof T> = Omit<T, K> | Omit<T, O>;
```

#### Type Parameters
- `T`: Base object type
- `K`: First mutually exclusive property
- `O`: Second mutually exclusive property

#### Description
- Ensures two specific properties cannot exist together in an object
- Unlike MutuallyWithObject, other properties are allowed to coexist
- Useful for handling mutual exclusivity between two specific properties

#### Example
```typescript
interface FormData {
  name: string;
  age: number;
  personalId?: string;
  passportNumber?: string;
}

// Create a type where personal ID and passport number are mutually exclusive
type IdentityFormData = Mutually<FormData, 'personalId', 'passportNumber'>;

// ✅ Valid: providing personal ID, no passport number
const data1: IdentityFormData = {
  name: 'John',
  age: 30,
  personalId: '110101199001011234'
};

// ✅ Valid: providing passport number, no personal ID
const data2: IdentityFormData = {
  name: 'Jane',
  age: 25,
  passportNumber: 'G12345678'
};

// ✅ Valid: providing neither
const data3: IdentityFormData = {
  name: 'Alex',
  age: 40
};

// ❌ Invalid: cannot provide both properties
const data4: IdentityFormData = {
  name: 'Sam',
  age: 35,
  personalId: '110101199001011234',
  passportNumber: 'G12345678'  // Error
};
```

### Generic<R, K, T>
Creates a new type that inherits all properties from the base type R but overwrites the type of a specific property K with type T.

```typescript
type Generic<R extends AnyObject, K extends keyof R, T> = R & { [P in K]: T };
```

#### Type Parameters
- `R`: Base object type
- `K`: Property key whose type needs to be overwritten
- `T`: New property type

#### Description
- Preserves all properties from the original type
- Replaces just the type of the specified property
- Useful for extending or specializing existing types

#### Example
```typescript
interface User {
  id: number;
  name: string;
  roles: string[];
}

// Create a new type that changes the roles property from string[] to a more specific Role[] type
interface Role {
  id: number;
  name: string;
  permissions: string[];
}

type EnhancedUser = Generic<User, 'roles', Role[]>;

// ✅ Valid: roles is now of type Role[]
const user: EnhancedUser = {
  id: 1,
  name: 'John',
  roles: [
    { id: 1, name: 'admin', permissions: ['read', 'write', 'delete'] },
    { id: 2, name: 'editor', permissions: ['read', 'write'] }
  ]
};
```

## Usage Notes

1. `PropertyKey` is commonly used when you need to type object keys or property accessors.

2. `AnyObject<T>` is useful when:
   - You need a type-safe object with consistent value types
   - You want to allow any valid JavaScript property key
   - You're working with dynamic property names

3. `RequiredDependency<T, K, D>` is particularly helpful when:
   - Building configuration interfaces
   - Defining API request types
   - Ensuring related properties are handled together
   - Implementing conditional property requirements

## Best Practices

1. Use `PropertyKey` when you need to explicitly type object keys or property accessors.

2. Use `AnyObject<T>` instead of `Record<string, T>` when you need to support all possible key types.

3. Use `RequiredDependency` to enforce property dependencies and create more type-safe interfaces.
