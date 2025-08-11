---
sidebar_position: 1
---

# API Overview

TypeScript API Pro provides a rich set of type utilities organized into four main modules:

## 📦 Module Structure

```
typescript-api-pro/
├── object/     # Object type utilities
├── array/      # Array type utilities
├── map/        # Map type utilities
└── set/        # Set type utilities
```

## 🔧 Core Types

### Basic Types

- [`PropertyKey`](./object-types#propertykey) - Object property key type
- [`AnyObject<T>`](./object-types#anyobject) - Generic object type

### Object Operations

- [`ValueOf<T>`](./object-types#valueof) - Extract object value types
- [`KeyOf<T>`](./object-types#keyof) - Extract object key types
- [`Generic<R, K, T>`](./object-types#generic) - Override object property type
- [`OmitByObject<T, U>`](./object-types#omitbyobject) - Exclude properties based on object structure

### Dependency Relationships

- [`RequiredDependency<T, K, D>`](./object-types#requireddependency) - Property dependency relationship
- [`MutuallyWithObject<T>`](./object-types#mutuallywithobject) - Mutually exclusive object properties
- [`Mutually<T, K, O>`](./object-types#mutually) - Two-property mutual exclusion

### Array Operations

- [`ArrayItem<T>`](./array-types#arrayitem) - Extract array element type

### Map Operations

- [`MapKeyOf<T>`](./map-types#mapkeyof) - Extract Map key type
- [`MapValueOf<T>`](./map-types#mapvalueof) - Extract Map value type
- [`MapToObject<T>`](./map-types#maptoobject) - Convert Map to object
- [`ObjectToMap<T>`](./map-types#objecttomap) - Convert object to Map
- [`OmitMapKey<T, K>`](./map-types#omitmapkey) - Exclude Map keys
- [`PickMapKey<T, K>`](./map-types#pickmapkey) - Select Map keys

### Set Operations

- [`SetValueOf<T>`](./set-types#setvalueof) - Extract Set element type
- [`OmitSetValue<T, V>`](./set-types#omitsetvalue) - Exclude Set values
- [`PickSetValue<T, V>`](./set-types#picksetvalue) - Select Set values
- [`ArrayToSet<T>`](./set-types#arraytoset) - Convert array to Set
- [`SetToArray<T>`](./set-types#settoarray) - Convert Set to array

## 🎯 Use Cases

### Type-Safe Configuration Objects

```typescript
import type { MutuallyWithObject, RequiredDependency } from 'typescript-api-pro';

interface DatabaseConfig {
  host?: string;
  port?: number;
  ssl?: boolean;
}

// Ensure host and port exist together or not at all
type SafeDatabaseConfig = RequiredDependency<DatabaseConfig, 'host', 'port'>;
```

### Mutually Exclusive Options

```typescript
import type { MutuallyWithObject } from 'typescript-api-pro';

interface AuthOptions {
  token: string;
  username: string;
  apiKey: string;
}

// Only one authentication method can be selected
type AuthMethod = MutuallyWithObject<AuthOptions>;
```

### Collection Type Conversion

```typescript
import type { ArrayToSet, MapToObject, SetToArray } from 'typescript-api-pro';

// Array to Set (automatic deduplication)
type UniqueColors = ArrayToSet<['red', 'blue', 'red', 'green']>; // Set<'red' | 'blue' | 'green'>

// Map to object
type ConfigObject = MapToObject<Map<'host' | 'port', string>>; // { host: string; port: string; }
```

## 📖 Learn More

Choose a specific type category to learn more details and usage examples:

- [Object Type Utilities](./object-types)
- [Array Type Utilities](./array-types)
- [Map Type Utilities](./map-types)
- [Set Type Utilities](./set-types)
