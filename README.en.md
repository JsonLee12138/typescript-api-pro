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