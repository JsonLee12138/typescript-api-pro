---
sidebar_position: 6
---

# String Type Utilities

String type utilities provide powerful tools for string manipulation at the type level, enabling transformations like converting camelCase to snake_case.

## Case Conversion

### Camel2SnakeCase

Convert camelCase strings to snake_case format with optional uppercase transformation.

```typescript
type Camel2SnakeCase<T extends string, U extends boolean = true> = /* ... */

// Examples
type Result1 = Camel2SnakeCase<'userName'>; // 'USER_NAME'
type Result2 = Camel2SnakeCase<'userId'>; // 'USER_ID'
type Result3 = Camel2SnakeCase<'myVariableName'>; // 'MY_VARIABLE_NAME'

// With lowercase option
type Result4 = Camel2SnakeCase<'userName', false>; // 'user_name'
type Result5 = Camel2SnakeCase<'userId', false>; // 'user_id'
type Result6 = Camel2SnakeCase<'myVariableName', false>; // 'my_variable_name'
```

**Type Parameters:**

- `T extends string` - The camelCase string to convert
- `U extends boolean = true` - Whether to use uppercase (default: `true`)

**Returns:**

- Snake_case formatted string type

## Real-World Examples

### API Request/Response Mapping

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface UserRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
}

// Convert all property names to UPPER_SNAKE_CASE for API
type ApiUserRequest = {
  [K in keyof UserRequest as Camel2SnakeCase<K & string>]: UserRequest[K]
};

// Result:
// {
//   FIRST_NAME: string;
//   LAST_NAME: string;
//   EMAIL_ADDRESS: string;
//   PHONE_NUMBER: string;
// }

// Usage
const apiPayload: ApiUserRequest = {
  FIRST_NAME: 'John',
  LAST_NAME: 'Doe',
  EMAIL_ADDRESS: 'john@example.com',
  PHONE_NUMBER: '+1234567890'
};
```

### Database Column Mapping

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface UserModel {
  userId: number;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Convert to lowercase snake_case for database columns
type DbUserColumns = {
  [K in keyof UserModel as Camel2SnakeCase<K & string, false>]: UserModel[K]
};

// Result:
// {
//   user_id: number;
//   user_name: string;
//   created_at: Date;
//   updated_at: Date;
//   is_active: boolean;
// }

// Query builder example
function buildQuery<T extends Record<string, unknown>>(
  tableName: string,
  data: T
): string {
  const columns = Object.keys(data).join(', ');
  const values = Object.values(data).map(v => `'${v}'`).join(', ');
  return `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
}

const userData: DbUserColumns = {
  user_id: 1,
  user_name: 'johndoe',
  created_at: new Date(),
  updated_at: new Date(),
  is_active: true
};

const query = buildQuery('users', userData);
```

### Environment Variable Naming

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface AppConfig {
  databaseUrl: string;
  apiKey: string;
  maxConnections: number;
  enableLogging: boolean;
  redisHost: string;
}

// Convert to UPPER_SNAKE_CASE for environment variables
type EnvVars = {
  [K in keyof AppConfig as Camel2SnakeCase<K & string>]: string
};

// Result:
// {
//   DATABASE_URL: string;
//   API_KEY: string;
//   MAX_CONNECTIONS: string;
//   ENABLE_LOGGING: string;
//   REDIS_HOST: string;
// }

// Environment loader
function loadEnv<T extends Record<string, unknown>>(
  keys: Array<keyof T>
): T {
  const result: Record<string, string> = {};

  for (const key of keys) {
    const envKey = String(key);
    result[envKey] = process.env[envKey] || '';
  }

  return result as T;
}

const env = loadEnv<EnvVars>([
  'DATABASE_URL',
  'API_KEY',
  'MAX_CONNECTIONS',
  'ENABLE_LOGGING',
  'REDIS_HOST'
]);
```

### GraphQL Schema Generation

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface Product {
  productId: string;
  productName: string;
  productPrice: number;
  productCategory: string;
}

// Generate GraphQL field names (lowercase snake_case)
type GraphQLProduct = {
  [K in keyof Product as Camel2SnakeCase<K & string, false>]: Product[K]
};

// Result:
// {
//   product_id: string;
//   product_name: string;
//   product_price: number;
//   product_category: string;
// }

const graphqlType = `
  type Product {
    product_id: String!
    product_name: String!
    product_price: Float!
    product_category: String!
  }
`;
```

### Form Field Name Conversion

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface FormData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  companyName?: string;
}

// Convert to snake_case for HTML form field names
type FormFieldNames = {
  [K in keyof FormData as Camel2SnakeCase<K & string, false>]: FormData[K]
};

// Result:
// {
//   first_name: string;
//   last_name: string;
//   email_address: string;
//   phone_number: string;
//   company_name?: string;
// }

// Form generator
function generateFormFields<T extends Record<string, unknown>>(
  data: T
): string {
  return Object.entries(data)
    .map(([key, value]) => {
      return `<input name="${key}" value="${value || ''}" />`;
    })
    .join('\n');
}

const formData: FormFieldNames = {
  first_name: 'John',
  last_name: 'Doe',
  email_address: 'john@example.com',
  phone_number: '+1234567890',
  company_name: 'Acme Inc'
};

const formHtml = generateFormFields(formData);
```

### Constants Definition

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface ErrorCodes {
  notFound: number;
  unauthorized: number;
  badRequest: number;
  internalError: number;
}

// Convert to UPPER_SNAKE_CASE for constants
type ErrorConstants = {
  [K in keyof ErrorCodes as Camel2SnakeCase<K & string>]: ErrorCodes[K]
};

// Result:
// {
//   NOT_FOUND: number;
//   UNAUTHORIZED: number;
//   BAD_REQUEST: number;
//   INTERNAL_ERROR: number;
// }

const HTTP_STATUS: ErrorConstants = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  INTERNAL_ERROR: 500
};

// Usage in code
function handleError(code: keyof ErrorConstants) {
  return HTTP_STATUS[code];
}

const statusCode = handleError('NOT_FOUND'); // 404
```

### Configuration File Keys

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

interface ServerConfig {
  serverHost: string;
  serverPort: number;
  maxUploadSize: number;
  enableCors: boolean;
  corsOrigin: string[];
}

// Convert to lowercase snake_case for config files (YAML/TOML)
type ConfigFileKeys = {
  [K in keyof ServerConfig as Camel2SnakeCase<K & string, false>]: ServerConfig[K]
};

// Result:
// {
//   server_host: string;
//   server_port: number;
//   max_upload_size: number;
//   enable_cors: boolean;
//   cors_origin: string[];
// }

// Config file content
const config: ConfigFileKeys = {
  server_host: '0.0.0.0',
  server_port: 3000,
  max_upload_size: 10485760, // 10MB
  enable_cors: true,
  cors_origin: ['http://localhost:3000', 'https://example.com']
};

// Generate YAML
function toYaml(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
      }
      return `${key}: ${value}`;
    })
    .join('\n');
}

const yamlConfig = toYaml(config);
```

## Type Safety Benefits

### Compile-Time Validation

```typescript
import type { Camel2SnakeCase } from 'typescript-api-pro';

// Type-safe key transformation
function transformKeys<T extends Record<string, unknown>>(
  obj: T
): { [K in keyof T as Camel2SnakeCase<K & string, false>]: T[K] } {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    // Transform camelCase to snake_case at runtime
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }

  return result as { [K in keyof T as Camel2SnakeCase<K & string, false>]: T[K] };
}

// Usage
const camelCaseData = {
  firstName: 'John',
  lastName: 'Doe',
  emailAddress: 'john@example.com'
};

const snakeCaseData = transformKeys(camelCaseData);
// TypeScript knows the result type:
// {
//   first_name: string;
//   last_name: string;
//   email_address: string;
// }

// Type-safe access
console.log(snakeCaseData.first_name); // OK
// console.log(snakeCaseData.firstName); // Error: Property 'firstName' does not exist
```

### Integration with Other Utilities

```typescript
import type { Camel2SnakeCase, KeyOf, ValueOf } from 'typescript-api-pro';

interface User {
  userId: number;
  userName: string;
  userEmail: string;
}

// Transform keys
type DbUser = {
  [K in keyof User as Camel2SnakeCase<K & string, false>]: User[K]
};

// Get all possible values
type DbUserValue = ValueOf<DbUser>; // number | string

// Get all keys
type DbUserKey = KeyOf<DbUser>; // 'user_id' | 'user_name' | 'user_email'

// Type-safe query builder
function buildSelectQuery<T extends Record<string, unknown>>(
  table: string,
  columns: Array<keyof T>
): string {
  return `SELECT ${columns.join(', ')} FROM ${table}`;
}

const query = buildSelectQuery<DbUser>('users', ['user_id', 'user_name']);
// Result: "SELECT user_id, user_name FROM users"
```

## Implementation Details

The `Camel2SnakeCase` type uses recursive conditional types to process each character:

1. **Fmt Helper**: Converts characters to uppercase or lowercase based on the boolean flag
2. **ToSnakeCase**: Recursively processes the string, adding underscores before uppercase letters
3. **Camel2SnakeCase**: Removes the leading underscore if present and applies the transformation

This provides compile-time type transformation with zero runtime overhead, ensuring type safety throughout your application.
