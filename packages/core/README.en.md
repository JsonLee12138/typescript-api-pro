# Typescript API Reference
[中文文档](https://github.com/JsonLee12138/typescript-api-pro/blob/main/README.md)

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
type Generic<R extends AnyObject, K extends keyof R, T> = Omit<R, K> & { [P in K]: T };
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

### OmitByObject<T, U>
Exclude all properties from type T that have the same key names as those in type U.

```typescript
type OmitByObject<T, U> = Pick<T, Exclude<keyof T, keyof U>>
```

#### Type Parameters
- `T`: The source object type
- `U`: The object type containing keys to be omitted

#### Description
- Excludes properties from the source object based on the keys of another object type.
- More flexible than the standard `Omit`, as it can omit properties based on the structure of an entire object type.
- Useful when you need to remove properties from one object that are present in the structure of another object.

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

// Create a type for personal information only, excluding contact info fields
type PersonalInfoOnly = OmitByObject<Person, ContactInfo>;

// Equivalent to { name: string; age: number; }
const personalInfo: PersonalInfoOnly = {
  name: 'Zhang San',
  age: 30
  // address and phone are omitted because they exist in ContactInfo
};

// Another example: Exclude common metadata fields
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

// Get only the business data of a product, excluding metadata
type ProductData = OmitByObject<Product, WithMetadata>;

// Equivalent to { name: string; price: number; description: string; }
const productData: ProductData = {
  name: 'Smartphone',
  price: 3999,
  description: 'The latest smartphone'
  // id, createdAt, and updatedAt are omitted
};
```

### ArrayItem<T>
A utility type that extracts the element type from an array type.

```typescript
type ArrayItem<T extends any[]> = T[number];
```

#### Type Parameters
- `T`: Any array type

#### Description
- Uses indexed access type `T[number]` to extract the element type from an array type
- Can be used to get element types from arrays, tuples, or readonly arrays
- Particularly useful when working with generic arrays, preserving specific type information of elements

#### Example
```typescript
// Simple array type
type NumberArray = number[];
type NumberItem = ArrayItem<NumberArray>; // number

// Tuple type
type StringNumberTuple = [string, number];
type TupleItem = ArrayItem<StringNumberTuple>; // string | number

// Readonly array
type ReadonlyStringArray = ReadonlyArray<string>;
type ReadonlyItem = ArrayItem<ReadonlyStringArray>; // string

// Generic array
interface User {
  id: number;
  name: string;
}

type UserArray = User[];
type UserItem = ArrayItem<UserArray>; // User
```

### ValueOf<T>
Extracts a union type of all property values from an object type.

```typescript
type ValueOf<T> = T[keyof T];
```

#### Type Parameters
- `T`: Any object type

#### Description
- Produces a union of all property value types of the object
- Useful for type mapping, inference, and utility types

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
Gets a union type of all property keys of an object.

```typescript
type KeyOf<T> = keyof T;
```

#### Type Parameters
- `T`: Any object type

#### Description
- Equivalent to TypeScript's built-in `keyof` operator
- Produces a union of all property names of the object

#### Example
```typescript
interface User {
  id: number;
  name: string;
  age: number;
}
type UserKeys = KeyOf<User>; // "id" | "name" | "age"
```

### MapKeyOf<T>
Extracts the key type from a Map type.

```typescript
type MapKeyOf<T extends Map<any, any>> = T extends Map<infer K, any> ? K : never;
```

#### Type Parameters
- `T` : Any Map type

#### Description
- Uses conditional types and the `infer` keyword to extract the key type from a Map type
- Returns a union type of all possible keys in the Map
- Returns `never` if the input is not a Map type

#### Example
```typescript
// Basic usage
type StringNumberMap = Map<string, number>;
type Keys = MapKeyOf<StringNumberMap>; // string

// Union key type
type UnionKeyMap = Map<string | number, boolean>;
type UnionKeys = MapKeyOf<UnionKeyMap>; // string | number

// Literal key type
type LiteralMap = Map<'name' | 'age', string>;
type LiteralKeys = MapKeyOf<LiteralMap>; // 'name' | 'age'
```

### MapValueOf<T>
Extracts the value type from a Map type.

```typescript
type MapValueOf<T extends Map<unknown, unknown>> = T extends Map<unknown, infer V> ? V : never;
```

#### Type Parameters
- `T`: Any Map type

#### Description
- Extracts the value type from a Map type
- Returns a union type of all possible values in the Map

#### Example
```typescript
// Basic usage
type StringNumberMap = Map<string, number>;
type Values = MapValueOf<StringNumberMap>; // number

// Union value type
type UnionValueMap = Map<string, number | boolean>;
type UnionValues = MapValueOf<UnionValueMap>; // number | boolean

// Object value type
interface User {
  id: number;
  name: string;
}
type UserMap = Map<string, User>;
type UserValue = MapValueOf<UserMap>; // User
```

### MapToObject<T>
Converts a Map type to an equivalent object type.

```typescript
type MapToObject<T extends Map<unknown, unknown>> = {
    [K in MapKeyOf<T> & PropertyKey]: T extends Map<unknown, infer V> ? V : never;
}
```

#### Type Parameters
- `T`: Any Map type

#### Description
- Converts a Map type to an equivalent object type
- Only works correctly when the Map's key type is a subset of `PropertyKey` (string | number | symbol)
- Preserves the original key-value relationships

#### Example
```typescript
// String key Map
type StringMap = Map<'name' | 'age', string>;
type StringObject = MapToObject<StringMap>; 
// { name: string; age: string; }

// Numeric key Map
type NumberMap = Map<1 | 2 | 3, boolean>;
type NumberObject = MapToObject<NumberMap>;
// { 1: boolean; 2: boolean; 3: boolean; }

// Practical example
const userMap: Map<'id' | 'name', string> = new Map([
  ['id', '123'],
  ['name', 'John']
]);

// Converted object type
type UserObject = MapToObject<typeof userMap>;
// { id: string; name: string; }
```

### ObjectToMap<T>
Converts an object type to an equivalent Map type.

```typescript
type ObjectToMap<T extends AnyObject> = Map<keyof T, T[keyof T]>;
```

#### Type Parameters
- `T`: Object type inheriting from `AnyObject`

#### Description
- Converts an object type to an equivalent Map type
- Uses object keys as Map keys and object values as Map values

#### Example
```typescript
// Basic object conversion
interface User {
  id: number;
  name: string;
  active: boolean;
}
type UserMap = ObjectToMap<User>;
// Map<'id' | 'name' | 'active', number | string | boolean>

// Configuration object conversion
interface Config {
  host: string;
  port: number;
  ssl: boolean;
}
type ConfigMap = ObjectToMap<Config>;
// Map<'host' | 'port' | 'ssl', string | number | boolean>
```

### OmitMapKey<T, K>
Creates a new Map type excluding specified keys.

```typescript
type OmitMapKey<T extends Map<unknown, unknown>, K extends MapKeyOf<T>> = 
  T extends Map<infer Keys, infer V> ? Map<Exclude<Keys, K>, V> : never;
```

#### Type Parameters
- `T`: Object type inheriting from AnyObject
- `K`: Keys to exclude (must exist in T)

#### Description
- Creates a new Map type excluding specified keys
- Preserves the original value type while removing specified key types
- Similar to the Omit utility type for object types

#### Example
```typescript
// Exclude single key
type OriginalMap = Map<'name' | 'age' | 'email', string>;
type WithoutEmail = OmitMapKey<OriginalMap, 'email'>;
// Map<'name' | 'age', string>

// Exclude multiple keys (using union type)
type WithoutNameAndAge = OmitMapKey<OriginalMap, 'name' | 'age'>;
// Map<'email', string>
```

### PickMapKey<T, K>
Creates a new Map type including only specified keys.

```typescript
export type PickMapKey<T extends Map<unknown, unknown>, K extends MapKeyOf<T>> = 
  T extends Map<unknown, infer V> ? Map<K, V> : never;
```

#### Type Parameters
- `T`: Object type inheriting from AnyObject
- `K`: Keys to include (must exist in T)

#### Description
- Creates a new Map type including only specified keys
- Preserves the original value type while selecting specific key types
- Similar to the Pick utility type for object types

#### Example
```typescript
// Select single key
type OriginalMap = Map<'name' | 'age' | 'email', string>;
type OnlyName = PickMapKey<OriginalMap, 'name'>;
// Map<'name', string>

// Select multiple keys
type NameAndAge = PickMapKey<OriginalMap, 'name' | 'age'>;
// Map<'name' | 'age', string>
```

### SetValueOf<T>
Extracts the element type from a Set type.

```typescript
type SetValueOf<T extends ReadonlySet<unknown>> = T extends ReadonlySet<infer V> ? V : never;
```

#### Type Parameters
- `T`: Any Set type

#### Description
- Extracts the element type from a Set type using conditional types and `infer`
- Returns a union type of all possible elements in the Set
- Returns `never` if the input is not a Set type

#### Example
```typescript
// Basic usage
type StringSet = Set<string>;
type StringElement = SetValueOf<StringSet>; // string

// Union type elements
type MixedSet = Set<string | number | boolean>;
type MixedElement = SetValueOf<MixedSet>; // string | number | boolean

// Literal type elements
type LiteralSet = Set<'red' | 'green' | 'blue'>;
type ColorElement = SetValueOf<LiteralSet>; // 'red' | 'green' | 'blue'

// Object type elements
interface User {
  id: number;
  name: string;
}
type UserSet = Set<User>;
type UserElement = SetValueOf<UserSet>; // User
```

### OmitSetValue<T, V>
Creates a new Set type excluding specified value types.

```typescript
type OmitSetValue<T extends Set<unknown>, V extends SetValueOf<T>> = 
  T extends Set<infer Values> ? Set<Exclude<Values, V>> : never;
```

#### Type Parameters
- `T`: Any Set type
- `V`: Values to exclude (must exist in T)

#### Description
- Creates a new Set type excluding specified element types
- Uses the Exclude utility type to remove specified types from the union
- Useful for scenarios requiring removal of specific element types from Sets

#### Example
```typescript
// Exclude single value type
type OriginalSet = Set<'apple' | 'banana' | 'orange'>;
type WithoutApple = OmitSetValue<OriginalSet, 'apple'>;
// Set<'banana' | 'orange'>

// Exclude multiple value types
type WithoutFruits = OmitSetValue<OriginalSet, 'apple' | 'banana'>;
// Set<'orange'>

// Numeric example
type NumberSet = Set<1 | 2 | 3 | 4 | 5>;
type WithoutOddNumbers = OmitSetValue<NumberSet, 1 | 3 | 5>;
// Set<2 | 4>
```

### PickSetValue<T, V>
Creates a new Set type including only specified value types.

```typescript
type PickSetValue<T extends Set<unknown>, V extends SetValueOf<T>> = Set<V>;
```

#### Type Parameters
- `T`: Any Set type
- `V`: Values to include (must exist in T)

#### Description
- Creates a new Set type including only specified element types
- Directly constructs a new Set with the specified value types
- Useful for extracting specific element types from existing Sets

#### Example
```typescript
// Select value types
type OriginalSet = Set<'red' | 'green' | 'blue' | 'yellow'>;
type PrimaryColors = PickSetValue<OriginalSet, 'red' | 'green' | 'blue'>;
// Set<'red' | 'green' | 'blue'>

// Numeric selection
type NumberSet = Set<1 | 2 | 3 | 4 | 5>;
type EvenNumbers = PickSetValue<NumberSet, 2 | 4>;
// Set<2 | 4>
```

### ArrayToSet<T>
Converts an array type to an equivalent Set type.

```typescript
type ArrayToSet<T extends readonly unknown[]> = Set<T[number]>;
```

#### Type Parameters
- T: Any array type

#### Description
- Converts an array type to an equivalent Set type
- Uses indexed access type `T[number]` to extract element types
- Automatically deduplicates repeating element types

#### Example
```typescript
// Basic array conversion
type StringArray = string[];
type StringSet = ArrayToSet<StringArray>; // Set<string>

// Tuple conversion
type ColorTuple = ['red', 'green', 'blue', 'red'];
type ColorSet = ArrayToSet<ColorTuple>; // Set<'red' | 'green' | 'blue'>

// Union type array
type MixedArray = (string | number)[];
type MixedSet = ArrayToSet<MixedArray>; // Set<string | number>

// Practical example
const fruits = ['apple', 'banana', 'apple', 'orange'] as const;
type FruitSet = ArrayToSet<typeof fruits>;
// Set<'apple' | 'banana' | 'orange'>
```

### SetToArray<T>
Converts a Set type to an equivalent array type.

```typescript
type SetToArray<T extends ReadonlySet<unknown>> = SetValueOf<T>[];
```

#### Type Parameters
- `T`: Any array type

#### Description
- Converts a Set type to an equivalent array type
- Extracts element types using SetValueOf and creates an array type
- Provides the inverse operation of ArrayToSet

#### Example
```typescript
// Basic Set conversion
type StringSet = Set<string>;
type StringArray = SetToArray<StringSet>; // string[]

// Literal Set conversion
type ColorSet = Set<'red' | 'green' | 'blue'>;
type ColorArray = SetToArray<ColorSet>; // ('red' | 'green' | 'blue')[]

// Object Set conversion
interface User {
  id: number;
  name: string;
}
type UserSet = Set<User>;
type UserArray = SetToArray<UserSet>; // User[]

// Practical example
function convertSetToArray<T extends Set<any>>(set: T): SetToArray<T> {
  return Array.from(set) as SetToArray<T>;
}
```

## 📝 Contribution Guide
Feel free to submit `issues` or `pull requests` to help improve `Hook-Fetch`.

## 📄 License

MIT

## Contact US

- [Discord](https://discord.gg/Ah55KD5d)
