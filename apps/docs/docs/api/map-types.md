---
sidebar_position: 4
---

# Map Type Utilities

Map type utilities provide powerful tools for working with TypeScript Map types, extracting keys and values, and converting between Maps and objects.

## Key and Value Extraction

### MapKeyOf

Extract the key type from a Map type.

```typescript
type MapKeyOf<T extends Map<unknown, unknown>> = T extends Map<infer K, unknown> ? K : never;

// Examples
type StringNumberMap = Map<string, number>;
type MapKeys = MapKeyOf<StringNumberMap>; // string

type UserIdMap = Map<'user' | 'admin' | 'guest', User>;
type UserKeys = MapKeyOf<UserIdMap>; // 'user' | 'admin' | 'guest'
```

### MapValueOf

Extract the value type from a Map type.

```typescript
type MapValueOf<T extends Map<unknown, unknown>> = T extends Map<unknown, infer V> ? V : never;

// Examples
type StringNumberMap = Map<string, number>;
type MapValues = MapValueOf<StringNumberMap>; // number

type UserRoleMap = Map<string, 'admin' | 'user' | 'guest'>;
type RoleValues = MapValueOf<UserRoleMap>; // 'admin' | 'user' | 'guest'
```

## Map Manipulation

### OmitMapKey

Create a new Map type with specified keys excluded.

```typescript
type OmitMapKey<T extends Map<unknown, unknown>, K extends MapKeyOf<T>>
  = T extends Map<infer Keys, infer V> ? Map<Exclude<Keys, K>, V> : never;

// Example
type FullConfigMap = Map<'host' | 'port' | 'password' | 'ssl', string>;
type PublicConfigMap = OmitMapKey<FullConfigMap, 'password'>;
// Result: Map<'host' | 'port' | 'ssl', string>
```

### PickMapKey

Create a new Map type with only specified keys included.

```typescript
type PickMapKey<T extends Map<unknown, unknown>, K extends MapKeyOf<T>>
  = T extends Map<unknown, infer V> ? Map<K, V> : never;

// Example
type FullConfigMap = Map<'host' | 'port' | 'password' | 'ssl', string>;
type ConnectionConfigMap = PickMapKey<FullConfigMap, 'host' | 'port'>;
// Result: Map<'host' | 'port', string>
```

## Type Conversion

### MapToObject

Convert a Map type to an object type.

```typescript
type MapToObject<T extends Map<PropertyKey, unknown>>
  = T extends Map<infer K, infer V> ? Record<K & PropertyKey, V> : never;

// Examples
type ConfigMap = Map<'host' | 'port', string>;
type ConfigObject = MapToObject<ConfigMap>;
// Result: { host: string; port: string; }

type StatusMap = Map<'loading' | 'success' | 'error', boolean>;
type StatusObject = MapToObject<StatusMap>;
// Result: { loading: boolean; success: boolean; error: boolean; }
```

### ObjectToMap

Convert an object type to a Map type.

```typescript
type ObjectToMap<T extends Record<PropertyKey, unknown>> = Map<keyof T, T[keyof T]>;

// Examples
interface UserConfig {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

type UserConfigMap = ObjectToMap<UserConfig>;
// Result: Map<'theme' | 'language' | 'notifications', 'light' | 'dark' | string | boolean>
```

## Real-World Examples

### Configuration Management

```typescript
import type { MapKeyOf, MapToObject, MapValueOf, OmitMapKey } from 'typescript-api-pro';

// Database configuration as Map
type DatabaseConfigMap = Map<
  'host' | 'port' | 'database' | 'username' | 'password' | 'ssl',
  string | number | boolean
>;

// Extract key and value types
type ConfigKeys = MapKeyOf<DatabaseConfigMap>; // 'host' | 'port' | 'database' | 'username' | 'password' | 'ssl'
type ConfigValues = MapValueOf<DatabaseConfigMap>; // string | number | boolean

// Create public configuration (without sensitive data)
type PublicConfigMap = OmitMapKey<DatabaseConfigMap, 'password' | 'username'>;

// Convert to object for JSON serialization
type PublicConfigObject = MapToObject<PublicConfigMap>;
// Result: { host: string | number | boolean; port: string | number | boolean; database: string | number | boolean; ssl: string | number | boolean; }

// Configuration manager
class ConfigManager {
  private config: Map<ConfigKeys, ConfigValues> = new Map();

  set<K extends ConfigKeys>(key: K, value: ConfigValues): void {
    this.config.set(key, value);
  }

  get<K extends ConfigKeys>(key: K): ConfigValues | undefined {
    return this.config.get(key);
  }

  getPublicConfig(): PublicConfigObject {
    const publicMap = new Map(this.config);
    publicMap.delete('password');
    publicMap.delete('username');
    return Object.fromEntries(publicMap) as PublicConfigObject;
  }
}
```

### Cache System

```typescript
import type { MapKeyOf, MapValueOf, PickMapKey } from 'typescript-api-pro';

// Cache entries with different types
type CacheMap = Map<
  'user:123' | 'post:456' | 'settings:global',
  User | Post | Settings
>;

type CacheKeys = MapKeyOf<CacheMap>; // 'user:123' | 'post:456' | 'settings:global'
type CacheValues = MapValueOf<CacheMap>; // User | Post | Settings

// User-specific cache
type UserCacheMap = PickMapKey<CacheMap, 'user:123'>;

// Cache manager with type safety
class TypedCache {
  private cache: Map<CacheKeys, CacheValues> = new Map();

  set<K extends CacheKeys>(
    key: K,
    value: CacheValues
  ): void {
    this.cache.set(key, value);
  }

  get<K extends CacheKeys>(key: K): CacheValues | undefined {
    return this.cache.get(key);
  }

  has(key: CacheKeys): boolean {
    return this.cache.has(key);
  }

  delete(key: CacheKeys): boolean {
    return this.cache.delete(key);
  }
}
```

### State Management

```typescript
import type { MapToObject, ObjectToMap } from 'typescript-api-pro';

// Application state as object
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  language: string;
  isLoading: boolean;
}

// Convert to Map for efficient updates
type AppStateMap = ObjectToMap<AppState>;

// State manager
class StateManager {
  private state: AppStateMap = new Map();

  // Initialize state
  constructor(initialState: AppState) {
    Object.entries(initialState).forEach(([key, value]) => {
      this.state.set(key as keyof AppState, value);
    });
  }

  // Update single state property
  setState<K extends keyof AppState>(key: K, value: AppState[K]): void {
    this.state.set(key, value);
  }

  // Get single state property
  getState<K extends keyof AppState>(key: K): AppState[K] | undefined {
    return this.state.get(key) as AppState[K] | undefined;
  }

  // Get entire state as object
  getAllState(): AppState {
    return Object.fromEntries(this.state) as AppState;
  }

  // Subscribe to state changes
  subscribe(callback: (state: AppState) => void): () => void {
    // Implementation would include actual subscription logic
    return () => {}; // Unsubscribe function
  }
}
```

### API Response Mapping

```typescript
import type { MapKeyOf, MapToObject, MapValueOf } from 'typescript-api-pro';

// API endpoints and their response types
type APIEndpointMap = Map<
  '/users' | '/posts' | '/comments',
  User[] | Post[] | Comment[]
>;

type Endpoints = MapKeyOf<APIEndpointMap>; // '/users' | '/posts' | '/comments'
type Responses = MapValueOf<APIEndpointMap>; // User[] | Post[] | Comment[]

// Convert to object for easier access
type APIEndpoints = MapToObject<APIEndpointMap>;
// Result: { '/users': User[] | Post[] | Comment[]; '/posts': User[] | Post[] | Comment[]; '/comments': User[] | Post[] | Comment[]; }

// API client with type safety
class APIClient {
  private cache: Map<Endpoints, Responses> = new Map();

  async fetch<K extends Endpoints>(
    endpoint: K
  ): Promise<Responses> {
    // Check cache first
    if (this.cache.has(endpoint)) {
      return this.cache.get(endpoint)!;
    }

    // Fetch from API
    const response = await fetch(endpoint);
    const data = await response.json() as Responses;

    // Cache the result
    this.cache.set(endpoint, data);

    return data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStatus(): Record<Endpoints, boolean> {
    const status = {} as Record<Endpoints, boolean>;
    const endpoints: Endpoints[] = ['/users', '/posts', '/comments'];

    endpoints.forEach((endpoint) => {
      status[endpoint] = this.cache.has(endpoint);
    });

    return status;
  }
}
```

### Form Field Mapping

```typescript
import type { MapKeyOf, MapValueOf, OmitMapKey } from 'typescript-api-pro';

// Form fields with validation rules
type FormFieldMap = Map<
  'email' | 'password' | 'confirmPassword' | 'terms',
  {
    value: string | boolean;
    error?: string;
    required: boolean;
  }
>;

type FieldNames = MapKeyOf<FormFieldMap>; // 'email' | 'password' | 'confirmPassword' | 'terms'
type FieldConfig = MapValueOf<FormFieldMap>; // { value: string | boolean; error?: string; required: boolean; }

// Form without terms (for API submission)
type APIFormMap = OmitMapKey<FormFieldMap, 'terms'>;

// Form validator
class FormValidator {
  private fields: FormFieldMap = new Map();

  setField(name: FieldNames, config: FieldConfig): void {
    this.fields.set(name, config);
  }

  getField(name: FieldNames): FieldConfig | undefined {
    return this.fields.get(name);
  }

  validate(): boolean {
    let isValid = true;

    this.fields.forEach((config, name) => {
      if (config.required && !config.value) {
        this.fields.set(name, {
          ...config,
          error: `${name} is required`
        });
        isValid = false;
      }
    });

    return isValid;
  }

  getErrors(): Map<FieldNames, string> {
    const errors = new Map<FieldNames, string>();

    this.fields.forEach((config, name) => {
      if (config.error) {
        errors.set(name, config.error);
      }
    });

    return errors;
  }
}
```

## Type Safety Benefits

### Compile-Time Validation

```typescript
import type { MapKeyOf, MapValueOf } from 'typescript-api-pro';

// Type-safe Map operations
function processMapEntries<T extends Map<unknown, unknown>>(
  map: T,
  processor: (key: MapKeyOf<T>, value: MapValueOf<T>) => void
): void {
  map.forEach((value, key) => {
    processor(key as MapKeyOf<T>, value as MapValueOf<T>);
  });
}

// Usage - TypeScript ensures type safety
const userRoles = new Map([
  ['admin', { permissions: ['read', 'write', 'delete'] }],
  ['user', { permissions: ['read'] }]
] as const);

processMapEntries(userRoles, (role, config) => {
  console.log(`Role ${role} has permissions:`, config.permissions);
  // TypeScript knows the exact types of role and config
});
```
