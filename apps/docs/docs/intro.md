---
sidebar_position: 1
---

# TypeScript API Pro Introduction

Welcome to **TypeScript API Pro** - A comprehensive TypeScript type utility library!

## What is TypeScript API Pro?

TypeScript API Pro is a type utility library designed specifically for TypeScript developers, providing a rich set of type manipulation tools to help you handle complex type scenarios more efficiently.

## Key Features

- 🎯 **Type Safe**: All utility types are strictly type-checked
- 🔧 **Practical Tools**: Covers type operations for objects, arrays, Maps, Sets and other common data structures
- 📚 **Complete Documentation**: Each type has detailed descriptions and examples
- 🚀 **Zero Dependencies**: Pure TypeScript type definitions with no runtime overhead
- 💡 **Easy to Use**: Clean API design that's easy to understand and use

## Quick Start

### Installation

```bash
npm install typescript-api-pro
```

### Basic Usage

```typescript
import type { AnyObject, ArrayItem, ValueOf } from 'typescript-api-pro';

// Create a generic object type
type Config = AnyObject<string>;

// Extract union type of object values
interface Status {
  success: 200;
  error: 500;
}
type StatusCode = ValueOf<Status>; // 200 | 500

// Extract array element type
type Users = User[];
type User = ArrayItem<Users>;
```

## Type Categories

TypeScript API Pro organizes type utilities into the following functional modules:

 - **[Object Types](./api/object-types)**: Handle object-related type operations
 - **[Array Types](./api/array-types)**: Handle array-related type operations
 - **[Map Types](./api/map-types)**: Handle Map-related type operations
 - **[Set Types](./api/set-types)**: Handle Set-related type operations

## Next Steps

Choose a type category that interests you to start exploring, or check out our [complete API reference](./api/overview).
