---
sidebar_position: 1.5
---

# Getting Started Guide

This guide will help you quickly get started with TypeScript API Pro through practical examples to understand how to use various type utilities.

## Installation

First, install TypeScript API Pro:

```bash
npm install typescript-api-pro
```

Or using yarn:

```bash
yarn add typescript-api-pro
```

## Basic Usage

### Importing Type Utilities

```typescript
// Import single type utility
// eslint-disable-next-line import/no-duplicates
import type { AnyObject, ValueOf } from 'typescript-api-pro';

// Import multiple type utilities
import type {
  ArrayItem,
  MapToObject,
  MutuallyWithObject,
  RequiredDependency
// eslint-disable-next-line import/no-duplicates
} from 'typescript-api-pro';
```

### First Example

Let's start with a simple configuration object:

```typescript
import type { AnyObject, ValueOf } from 'typescript-api-pro';

// Define a generic configuration object
interface AppConfig {
  database: {
    host: string;
    port: number;
  };
  server: {
    port: number;
    ssl: boolean;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    file: string;
  };
}

// Extract all configuration value types
type ConfigValue = ValueOf<AppConfig>;

// Create a generic configuration store
type ConfigStore = AnyObject<ConfigValue>;
```

## Common Use Cases

### 1. Form Validation

Handle mutually exclusive fields in forms:

```typescript
import type { MutuallyWithObject, RequiredDependency } from 'typescript-api-pro';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  newsletter?: boolean;
  sms?: boolean;
}

// Only one contact method can be selected
type ContactMethod = MutuallyWithObject<Pick<ContactForm, 'email' | 'phone'>>;

// If SMS is selected, phone number must be provided
type FormWithSMS = RequiredDependency<ContactForm, 'sms', 'phone'>;
```

### 2. API Response Handling

Handle different states of API responses:

```typescript
import type { Mutually, ValueOf } from 'typescript-api-pro';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  loading: boolean;
  timestamp: number;
}

// Ensure data and error don't exist simultaneously
type SafeApiResponse<T> = Mutually<ApiResponse<T>, 'data', 'error'>;
```

### 3. Array and Collection Operations

Handle array and collection types:

```typescript
import type { ArrayItem, ArrayToSet, SetValueOf } from 'typescript-api-pro';

// User permissions array
const permissions = ['read', 'write', 'delete', 'admin'] as const;
type Permission = ArrayItem<typeof permissions>;

// Convert to Set type (automatic deduplication)
type PermissionSet = ArrayToSet<typeof permissions>;

// Extract Set element type
type PermissionElement = SetValueOf<PermissionSet>;
```

### 4. Map and Object Conversion

Type-safe conversion between Maps and objects:

```typescript
import type { MapKeyOf, MapToObject, MapValueOf, ObjectToMap } from 'typescript-api-pro';

// Configuration Map
type ConfigMap = Map<'host' | 'port' | 'ssl', string | number | boolean>;

// Convert to object type
type ConfigObject = MapToObject<ConfigMap>;

// Reverse conversion
interface ServerConfig {
  host: string;
  port: number;
  ssl: boolean;
}

type ServerConfigMap = ObjectToMap<ServerConfig>;

// Extract Map key and value types
type ConfigKeys = MapKeyOf<ConfigMap>; // 'host' | 'port' | 'ssl'
type ConfigValues = MapValueOf<ConfigMap>; // string | number | boolean
```

## Advanced Usage

### Combining Multiple Type Utilities

```typescript
import type {
  ArrayItem,
  Generic,
  OmitByObject,
  RequiredDependency
} from 'typescript-api-pro';

// Base user type
interface BaseUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Metadata fields
interface Metadata {
  createdAt: Date;
  updatedAt: Date;
}

// 1. Remove metadata fields
type UserWithoutMetadata = OmitByObject<BaseUser, Metadata>;

// 2. Change roles field type to more specific type
interface Role {
  id: number;
  name: string;
  permissions: string[];
}

type UserWithRoles = Generic<UserWithoutMetadata, 'roles', Role[]>;

// 3. Extract role array element type
type UserRole = ArrayItem<UserWithRoles['roles']>; // Role
```

## Best Practices

### 1. Naming Conventions

```typescript
// ✅ Good naming
type UserPermissions = PickSetValue<AllPermissions, 'read' | 'write'>;
type PublicUserInfo = OmitByObject<User, SensitiveFields>;
type ConfigValue = ValueOf<AppConfig>;

// ❌ Avoid
type T1 = PickSetValue<T2, T3>;
type X = OmitByObject<Y, Z>;
```

### 2. Type Organization

```typescript
// Group related type definitions together
namespace UserTypes {
  export interface Base {
    id: number;
    name: string;
    email: string;
  }

  export interface Metadata {
    createdAt: Date;
    updatedAt: Date;
  }

  export type WithoutMetadata = OmitByObject<Base & Metadata, Metadata>;
  export type Public = Omit<WithoutMetadata, 'email'>;
}
```

### 3. Documentation Comments

```typescript
/**
 * User configuration type that ensures database configuration integrity
 * If host is provided, port must also be provided
 */
type DatabaseConfig = RequiredDependency<
  {
    name: string;
    host?: string;
    port?: number;
  },
  'host',
  'port'
>;
```

## Next Steps

Now that you understand the basic usage of TypeScript API Pro, you can:

1. Check the [API Reference](./api/overview) to learn about all available type utilities
2. Explore specific type categories:
   - [Object Type Utilities](./api/object-types)
   - [Array Type Utilities](./api/array-types)
   - [Map Type Utilities](./api/map-types)
   - [Set Type Utilities](./api/set-types)
3. Start using these type utilities in your projects

If you encounter any issues, feel free to ask questions in [GitHub Issues](https://github.com/JsonLee12138/typescript-api-pro/issues)!
