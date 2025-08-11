---
sidebar_position: 5
---

# Set 类型工具

Set 类型工具提供了处理 TypeScript Set 类型、提取元素类型以及在 Set 和数组之间进行转换的工具。

## 元素类型提取

### SetValueOf

从 Set 类型中提取元素类型。

```typescript
type SetValueOf<T extends Set<unknown>> = T extends Set<infer V> ? V : never;

// 示例
type StringSet = Set<string>;
type StringElement = SetValueOf<StringSet>; // string

type NumberSet = Set<number>;
type NumberElement = SetValueOf<NumberSet>; // number

type UnionSet = Set<string | number | boolean>;
type UnionElement = SetValueOf<UnionSet>; // string | number | boolean
```

## Set 操作

### OmitSetValue

创建一个排除指定值的新 Set 类型。

```typescript
type OmitSetValue<T extends Set<unknown>, V extends SetValueOf<T>>
  = T extends Set<infer U> ? Set<Exclude<U, V>> : never;

// 示例
type ColorSet = Set<'red' | 'green' | 'blue' | 'yellow'>;
type PrimaryColorSet = OmitSetValue<ColorSet, 'yellow'>;
// 结果: Set<'red' | 'green' | 'blue'>

type StatusSet = Set<'pending' | 'loading' | 'success' | 'error'>;
type ActiveStatusSet = OmitSetValue<StatusSet, 'pending'>;
// 结果: Set<'loading' | 'success' | 'error'>
```

### PickSetValue

创建一个只包含指定值的新 Set 类型。

```typescript
type PickSetValue<T extends Set<unknown>, V extends SetValueOf<T>>
  = T extends Set<unknown> ? Set<V> : never;

// 示例
type ColorSet = Set<'red' | 'green' | 'blue' | 'yellow'>;
type WarmColorSet = PickSetValue<ColorSet, 'red' | 'yellow'>;
// 结果: Set<'red' | 'yellow'>

type PermissionSet = Set<'read' | 'write' | 'delete' | 'admin'>;
type BasicPermissionSet = PickSetValue<PermissionSet, 'read' | 'write'>;
// 结果: Set<'read' | 'write'>
```

## 类型转换

### ArrayToSet

将数组类型转换为 Set 类型（在类型级别自动去除重复项）。

```typescript
type ArrayToSet<T extends readonly unknown[]> = Set<T[number]>;

// 示例
type ColorArray = ['red', 'green', 'blue', 'red']; // 包含重复项的数组
type ColorSet = ArrayToSet<ColorArray>; // Set<'red' | 'green' | 'blue'>

type NumberArray = [1, 2, 3, 2, 1];
type NumberSet = ArrayToSet<NumberArray>; // Set<1 | 2 | 3>

// 适用于只读数组
type ReadonlyColors = readonly ['red', 'green', 'blue'];
type ReadonlyColorSet = ArrayToSet<ReadonlyColors>; // Set<'red' | 'green' | 'blue'>
```

### SetToArray

将 Set 类型转换为数组类型。

```typescript
type SetToArray<T extends Set<unknown>> = Array<SetValueOf<T>>;

// 示例
type StatusSet = Set<'loading' | 'success' | 'error'>;
type StatusArray = SetToArray<StatusSet>; // Array<'loading' | 'success' | 'error'>

type NumberSet = Set<number>;
type NumberArray = SetToArray<NumberSet>; // Array<number>
```

## 实际应用示例

### 权限系统

```typescript
import type { OmitSetValue, PickSetValue, SetValueOf } from 'typescript-api-pro';

// 定义所有可能的权限
type AllPermissions = Set<'read' | 'write' | 'delete' | 'admin' | 'moderate' | 'export'>;
type Permission = SetValueOf<AllPermissions>; // 'read' | 'write' | 'delete' | 'admin' | 'moderate' | 'export'

// 基础用户权限（无管理员或审核权限）
type UserPermissions = OmitSetValue<AllPermissions, 'admin' | 'moderate'>;

// 仅管理员权限
type AdminPermissions = PickSetValue<AllPermissions, 'admin' | 'moderate' | 'export'>;

// 权限管理器
class PermissionManager {
  private userPermissions: Set<Permission> = new Set();

  grantPermission(permission: Permission): void {
    this.userPermissions.add(permission);
  }

  revokePermission(permission: Permission): void {
    this.userPermissions.delete(permission);
  }

  hasPermission(permission: Permission): boolean {
    return this.userPermissions.has(permission);
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(p => this.userPermissions.has(p));
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(p => this.userPermissions.has(p));
  }

  getPermissions(): Permission[] {
    return Array.from(this.userPermissions);
  }

  isAdmin(): boolean {
    return this.hasPermission('admin');
  }

  canModerate(): boolean {
    return this.hasAnyPermission(['admin', 'moderate']);
  }
}
```

### 标签系统

```typescript
import type { ArrayToSet, SetToArray, SetValueOf } from 'typescript-api-pro';

// 文章标签
type ArticleTagArray = ['javascript', 'typescript', 'react', 'vue', 'angular'];
type ArticleTagSet = ArrayToSet<ArticleTagArray>; // Set<'javascript' | 'typescript' | 'react' | 'vue' | 'angular'>
type ArticleTag = SetValueOf<ArticleTagSet>; // 'javascript' | 'typescript' | 'react' | 'vue' | 'angular'

// 转换回数组用于迭代
type TagArray = SetToArray<ArticleTagSet>; // Array<'javascript' | 'typescript' | 'react' | 'vue' | 'angular'>

// 标签管理器
class TagManager {
  private availableTags: Set<ArticleTag> = new Set([
    'javascript',
    'typescript',
    'react',
    'vue',
    'angular'
  ]);

  private articleTags: Map<string, Set<ArticleTag>> = new Map();

  addTag(articleId: string, tag: ArticleTag): boolean {
    if (!this.availableTags.has(tag)) {
      return false; // 标签不可用
    }

    if (!this.articleTags.has(articleId)) {
      this.articleTags.set(articleId, new Set());
    }

    this.articleTags.get(articleId)!.add(tag);
    return true;
  }

  removeTag(articleId: string, tag: ArticleTag): boolean {
    const tags = this.articleTags.get(articleId);
    if (!tags)
      return false;

    return tags.delete(tag);
  }

  getArticleTags(articleId: string): ArticleTag[] {
    const tags = this.articleTags.get(articleId);
    return tags ? Array.from(tags) : [];
  }

  findArticlesByTag(tag: ArticleTag): string[] {
    const articles: string[] = [];

    this.articleTags.forEach((tags, articleId) => {
      if (tags.has(tag)) {
        articles.push(articleId);
      }
    });

    return articles;
  }

  getPopularTags(): { tag: ArticleTag; count: number }[] {
    const tagCounts = new Map<ArticleTag, number>();

    this.articleTags.forEach((tags) => {
      tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }
}
```

### 功能标志系统

```typescript
import type { OmitSetValue, PickSetValue, SetValueOf } from 'typescript-api-pro';

// 所有可能的功能标志
type AllFeatureFlags = Set<
  'darkMode' | 'newDashboard' | 'advancedSearch' | 'betaFeatures'
  | 'experimentalUI' | 'premiumFeatures' | 'debugMode'
>;

type FeatureFlag = SetValueOf<AllFeatureFlags>;

// 生产环境安全功能（无调试或实验性功能）
type ProductionFeatures = OmitSetValue<AllFeatureFlags, 'debugMode' | 'experimentalUI'>;

// 仅高级功能
type PremiumFeatures = PickSetValue<AllFeatureFlags, 'premiumFeatures' | 'advancedSearch'>;

// 功能标志管理器
class FeatureFlagManager {
  private enabledFlags: Set<FeatureFlag> = new Set();
  private userTier: 'free' | 'premium' = 'free';

  constructor(userTier: 'free' | 'premium' = 'free') {
    this.userTier = userTier;
    this.initializeDefaultFlags();
  }

  private initializeDefaultFlags(): void {
    // 为所有用户启用基础功能
    this.enabledFlags.add('darkMode');
    this.enabledFlags.add('newDashboard');

    // 为高级用户启用高级功能
    if (this.userTier === 'premium') {
      this.enabledFlags.add('premiumFeatures');
      this.enabledFlags.add('advancedSearch');
    }
  }

  enableFlag(flag: FeatureFlag): boolean {
    // 检查用户是否有权访问高级功能
    const premiumFlags: FeatureFlag[] = ['premiumFeatures', 'advancedSearch'];
    if (premiumFlags.includes(flag) && this.userTier !== 'premium') {
      return false; // 访问被拒绝
    }

    this.enabledFlags.add(flag);
    return true;
  }

  disableFlag(flag: FeatureFlag): void {
    this.enabledFlags.delete(flag);
  }

  isEnabled(flag: FeatureFlag): boolean {
    return this.enabledFlags.has(flag);
  }

  getEnabledFlags(): FeatureFlag[] {
    return Array.from(this.enabledFlags);
  }

  hasAnyFlag(flags: FeatureFlag[]): boolean {
    return flags.some(flag => this.enabledFlags.has(flag));
  }

  hasAllFlags(flags: FeatureFlag[]): boolean {
    return flags.every(flag => this.enabledFlags.has(flag));
  }

  upgradeToPremium(): void {
    this.userTier = 'premium';
    this.enabledFlags.add('premiumFeatures');
    this.enabledFlags.add('advancedSearch');
  }
}
```

## 类型安全优势

### 编译时验证

```typescript
import type { SetValueOf } from 'typescript-api-pro';

// 类型安全的 Set 操作
function processSetValues<T extends Set<unknown>>(
  set: T,
  processor: (value: SetValueOf<T>) => void
): void {
  set.forEach((value) => {
    processor(value as SetValueOf<T>);
  });
}

// 使用示例 - TypeScript 确保类型安全
const statusSet = new Set(['loading', 'success', 'error'] as const);

processSetValues(statusSet, (status) => {
  console.log(`处理状态: ${status}`);
  // TypeScript 知道 status 是 'loading' | 'success' | 'error'
});
```
