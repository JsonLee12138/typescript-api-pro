---
sidebar_position: 2
---

# Object Type Utilities

Object type utilities provide powerful tools for manipulating and transforming object types in TypeScript.

## Basic Types

### PropertyKey

Standard TypeScript property key type.

```typescript
type PropertyKey = string | number | symbol;
```

### AnyObject

Generic object type with flexible key-value pairs.

```typescript
type AnyObject<T = any> = Record<PropertyKey, T>;

// Usage
type StringObject = AnyObject<string>; // Record<PropertyKey, string>
type NumberObject = AnyObject<number>; // Record<PropertyKey, number>
```

## Value and Key Extraction

### ValueOf

Extract all possible value types from an object type.

```typescript
type ValueOf<T> = T[keyof T];

// Example
interface User {
  id: number;
  name: string;
  active: boolean;
}

type UserValue = ValueOf<User>; // number | string | boolean
```

### KeyOf

Extract all key types from an object (alias for `keyof`).

```typescript
type KeyOf<T> = keyof T;

// Example
type UserKeys = KeyOf<User>; // "id" | "name" | "active"
```

## Property Override

### Generic

Override a specific property type in an object.

```typescript
type Generic<R, K extends keyof R, T> = Omit<R, K> & Record<K, T>;

// Example
interface User {
  id: number;
  name: string;
  createdAt: Date;
}

// Override createdAt to be a string
type UserWithStringDate = Generic<User, 'createdAt', string>;
// Result: { id: number; name: string; createdAt: string; }
```

## Advanced Filtering

### OmitByObject

Exclude properties from an object based on another object's structure.

```typescript
type OmitByObject<T, U> = Omit<T, keyof U>;

// Example
interface FullUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface SensitiveFields {
  password: string;
}

type PublicUser = OmitByObject<FullUser, SensitiveFields>;
// Result: { id: number; name: string; email: string; }
```

## Dependency Relationships

### RequiredDependency

Create dependency relationships between object properties.

```typescript
Omit<T, D> & (Partial<{ [P in K | D]: never }> | Required<Pick<T, K | D>>);

// Example
interface DatabaseConfig {
  host?: string;
  port?: number;
  ssl?: boolean;
}

// When host is provided, port must also be provided
type SafeConfig = RequiredDependency<DatabaseConfig, 'host', 'port'>;

const config1: SafeConfig = { ssl: true }; // ✅ Valid
const config2: SafeConfig = { host: 'localhost', port: 3306 }; // ✅ Valid
const config3: SafeConfig = { host: 'localhost' }; // ❌ Error: port is required
```

## Mutual Exclusion

### MutuallyWithObject

Create mutually exclusive properties from an object type.

```typescript
type MutuallyWithObject<T> = {
  [K in keyof T]: Record<K, T[K]> & Partial<Record<Exclude<keyof T, K>, never>>;
}[keyof T];

// Example
interface AuthMethods {
  token: string;
  username: string;
  apiKey: string;
}

type AuthMethod = MutuallyWithObject<AuthMethods>;

const auth1: AuthMethod = { token: 'abc123' }; // ✅ Valid
const auth2: AuthMethod = { username: 'john' }; // ✅ Valid
const auth3: AuthMethod = { token: 'abc', username: 'john' }; // ❌ Error: mutually exclusive
```

### Mutually

Create mutual exclusion between two specific properties.

```typescript
type Mutually<T, K extends keyof T, O extends keyof T>
  = (T & Record<K, T[K]> & Partial<Record<O, never>>)
    | (T & Record<O, T[O]> & Partial<Record<K, never>>);

// Example
interface PaymentOptions {
  amount: number;
  creditCard?: string;
  paypal?: string;
}

type Payment = Mutually<PaymentOptions, 'creditCard', 'paypal'>;

const payment1: Payment = { amount: 100, creditCard: '1234' }; // ✅ Valid
const payment2: Payment = { amount: 100, paypal: 'user@example.com' }; // ✅ Valid
const payment3: Payment = { amount: 100, creditCard: '1234', paypal: 'user@example.com' }; // ❌ Error
```

## Real-World Examples

### API Configuration

```typescript
import type { MutuallyWithObject, RequiredDependency } from 'typescript-api-pro';

interface APIConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  auth?: {
    token?: string;
    basic?: { username: string; password: string };
    oauth?: { clientId: string; clientSecret: string };
  };
}

// Ensure timeout and retries work together
type ReliableAPIConfig = RequiredDependency<APIConfig, 'timeout', 'retries'>;

// Ensure only one auth method is used
type AuthConfig = MutuallyWithObject<NonNullable<APIConfig['auth']>>;
```

### Form Validation

```typescript
interface FormField {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

// When minLength is set, maxLength should also be considered
type LengthValidation = RequiredDependency<FormField, 'minLength', 'maxLength'>;
```

### Component Props

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
}

// Loading and disabled are mutually exclusive
type ButtonState = Mutually<ButtonProps, 'loading', 'disabled'>;
```
