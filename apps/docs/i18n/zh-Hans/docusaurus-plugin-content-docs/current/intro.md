---
sidebar_position: 1
---

# TypeScript API Pro 介绍

欢迎使用 **TypeScript API Pro** - 一个全面的 TypeScript 类型工具库！

## 什么是 TypeScript API Pro？

TypeScript API Pro 是一个专为 TypeScript 开发者设计的类型工具库，提供了丰富的类型操作工具，帮助你更高效地处理复杂的类型场景。

## 主要特性

- 🎯 **类型安全**: 所有工具类型都经过严格的类型检查
- 🔧 **实用工具**: 涵盖对象、数组、Map、Set 等常用数据结构的类型操作
- 📚 **完整文档**: 每个类型都有详细的说明和示例
- 🚀 **零依赖**: 纯 TypeScript 类型定义，无运行时开销
- 💡 **易于使用**: 简洁的 API 设计，易于理解和使用

## 快速开始

### 安装

```bash
npm install typescript-api-pro
```

### 基本使用

```typescript
import type { AnyObject, ArrayItem, ValueOf } from 'typescript-api-pro';

// 创建一个通用对象类型
type Config = AnyObject<string>;

// 提取对象值的联合类型
interface Status {
  success: 200;
  error: 500;
}
type StatusCode = ValueOf<Status>; // 200 | 500

// 提取数组元素类型
type Users = User[];
type User = ArrayItem<Users>;
```

## 类型分类

TypeScript API Pro 将类型工具按功能分为以下几个模块：

- **[对象类型](../api/object-types)**: 处理对象相关的类型操作
- **[数组类型](../api/array-types)**: 处理数组相关的类型操作
- **[Map 类型](../api/map-types)**: 处理 Map 相关的类型操作
- **[Set 类型](../api/set-types)**: 处理 Set 相关的类型操作

## 下一步

选择一个感兴趣的类型分类开始探索，或者查看我们的[完整 API 参考](../api/overview)。
