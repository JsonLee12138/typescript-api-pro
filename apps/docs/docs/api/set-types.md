---
sidebar_position: 5
---

# Set Type Utilities

Set type utilities provide tools for working with TypeScript Set types, extracting element types, and converting between Sets and arrays.

## Element Type Extraction

### SetValueOf

Extract the element type from a Set type.

```typescript
type SetValueOf<T extends Set<unknown>> = T extends Set<infer V> ? V : never;

// Examples
type StringSet = Set<string>;
type StringElement = SetValueOf<StringSet>; // string

type NumberSet = Set<number>;
type NumberElement = SetValueOf<NumberSet>; // number

type UnionSet = Set<string | number | boolean>;
type UnionElement = SetValueOf<UnionSet>; // string | number | boolean
```

## Set Manipulation

### OmitSetValue

Create a new Set type with specified values excluded.

```typescript
type OmitSetValue<T extends Set<unknown>, V extends SetValueOf<T>>
  = T extends Set<infer U> ? Set<Exclude<U, V>> : never;

// Example
type ColorSet = Set<'red' | 'green' | 'blue' | 'yellow'>;
type PrimaryColorSet = OmitSetValue<ColorSet, 'yellow'>;
// Result: Set<'red' | 'green' | 'blue'>

type StatusSet = Set<'pending' | 'loading' | 'success' | 'error'>;
type ActiveStatusSet = OmitSetValue<StatusSet, 'pending'>;
// Result: Set<'loading' | 'success' | 'error'>
```

### PickSetValue

Create a new Set type with only specified values included.

```typescript
type PickSetValue<T extends Set<unknown>, V extends SetValueOf<T>>
  = T extends Set<unknown> ? Set<V> : never;

// Example
type ColorSet = Set<'red' | 'green' | 'blue' | 'yellow'>;
type WarmColorSet = PickSetValue<ColorSet, 'red' | 'yellow'>;
// Result: Set<'red' | 'yellow'>

type PermissionSet = Set<'read' | 'write' | 'delete' | 'admin'>;
type BasicPermissionSet = PickSetValue<PermissionSet, 'read' | 'write'>;
// Result: Set<'read' | 'write'>
```

## Type Conversion

### ArrayToSet

Convert an array type to a Set type (automatically removes duplicates at type level).

```typescript
type ArrayToSet<T extends readonly unknown[]> = Set<T[number]>;

// Examples
type ColorArray = ['red', 'green', 'blue', 'red']; // Array with duplicates
type ColorSet = ArrayToSet<ColorArray>; // Set<'red' | 'green' | 'blue'>

type NumberArray = [1, 2, 3, 2, 1];
type NumberSet = ArrayToSet<NumberArray>; // Set<1 | 2 | 3>

// Works with readonly arrays
type ReadonlyColors = readonly ['red', 'green', 'blue'];
type ReadonlyColorSet = ArrayToSet<ReadonlyColors>; // Set<'red' | 'green' | 'blue'>
```

### SetToArray

Convert a Set type to an array type.

```typescript
type SetToArray<T extends Set<unknown>> = Array<SetValueOf<T>>;

// Examples
type StatusSet = Set<'loading' | 'success' | 'error'>;
type StatusArray = SetToArray<StatusSet>; // Array<'loading' | 'success' | 'error'>

type NumberSet = Set<number>;
type NumberArray = SetToArray<NumberSet>; // Array<number>
```

## Real-World Examples

### Permission System

```typescript
import type { OmitSetValue, PickSetValue, SetValueOf } from 'typescript-api-pro';

// Define all possible permissions
type AllPermissions = Set<'read' | 'write' | 'delete' | 'admin' | 'moderate' | 'export'>;
type Permission = SetValueOf<AllPermissions>; // 'read' | 'write' | 'delete' | 'admin' | 'moderate' | 'export'

// Basic user permissions (no admin or moderate)
type UserPermissions = OmitSetValue<AllPermissions, 'admin' | 'moderate'>;

// Admin-only permissions
type AdminPermissions = PickSetValue<AllPermissions, 'admin' | 'moderate' | 'export'>;

// Permission manager
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

### Tag System

```typescript
import type { ArrayToSet, SetToArray, SetValueOf } from 'typescript-api-pro';

// Article tags
type ArticleTagArray = ['javascript', 'typescript', 'react', 'vue', 'angular'];
type ArticleTagSet = ArrayToSet<ArticleTagArray>; // Set<'javascript' | 'typescript' | 'react' | 'vue' | 'angular'>
type ArticleTag = SetValueOf<ArticleTagSet>; // 'javascript' | 'typescript' | 'react' | 'vue' | 'angular'

// Convert back to array for iteration
type TagArray = SetToArray<ArticleTagSet>; // Array<'javascript' | 'typescript' | 'react' | 'vue' | 'angular'>

// Tag manager
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
      return false; // Tag not available
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

### Feature Flag System

```typescript
import type { OmitSetValue, PickSetValue, SetValueOf } from 'typescript-api-pro';

// All possible feature flags
type AllFeatureFlags = Set<
  'darkMode' | 'newDashboard' | 'advancedSearch' | 'betaFeatures'
  | 'experimentalUI' | 'premiumFeatures' | 'debugMode'
>;

type FeatureFlag = SetValueOf<AllFeatureFlags>;

// Production-safe features (no debug or experimental)
type ProductionFeatures = OmitSetValue<AllFeatureFlags, 'debugMode' | 'experimentalUI'>;

// Premium-only features
type PremiumFeatures = PickSetValue<AllFeatureFlags, 'premiumFeatures' | 'advancedSearch'>;

// Feature flag manager
class FeatureFlagManager {
  private enabledFlags: Set<FeatureFlag> = new Set();
  private userTier: 'free' | 'premium' = 'free';

  constructor(userTier: 'free' | 'premium' = 'free') {
    this.userTier = userTier;
    this.initializeDefaultFlags();
  }

  private initializeDefaultFlags(): void {
    // Enable basic features for all users
    this.enabledFlags.add('darkMode');
    this.enabledFlags.add('newDashboard');

    // Enable premium features for premium users
    if (this.userTier === 'premium') {
      this.enabledFlags.add('premiumFeatures');
      this.enabledFlags.add('advancedSearch');
    }
  }

  enableFlag(flag: FeatureFlag): boolean {
    // Check if user has access to premium features
    const premiumFlags: FeatureFlag[] = ['premiumFeatures', 'advancedSearch'];
    if (premiumFlags.includes(flag) && this.userTier !== 'premium') {
      return false; // Access denied
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

### Event System

```typescript
import type { ArrayToSet, SetValueOf } from 'typescript-api-pro';

// Define event types
type EventTypeArray = ['click', 'hover', 'focus', 'blur', 'keydown', 'keyup', 'submit'];
type EventTypeSet = ArrayToSet<EventTypeArray>;
type EventType = SetValueOf<EventTypeSet>;

// Event listener manager
class EventManager {
  private listeners: Map<EventType, Set<(event: Event) => void>> = new Map();

  addEventListener(type: EventType, listener: (event: Event) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)!.add(listener);
  }

  removeEventListener(type: EventType, listener: (event: Event) => void): void {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.delete(listener);

      // Clean up empty sets
      if (typeListeners.size === 0) {
        this.listeners.delete(type);
      }
    }
  }

  dispatchEvent(type: EventType, event: Event): void {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.forEach((listener) => {
        try {
          listener(event);
        }
        catch (error) {
          console.error(`Error in ${type} event listener:`, error);
        }
      });
    }
  }

  getListenerCount(type: EventType): number {
    return this.listeners.get(type)?.size || 0;
  }

  getAllEventTypes(): EventType[] {
    return Array.from(this.listeners.keys());
  }

  hasListeners(type: EventType): boolean {
    return this.getListenerCount(type) > 0;
  }

  removeAllListeners(type?: EventType): void {
    if (type) {
      this.listeners.delete(type);
    }
    else {
      this.listeners.clear();
    }
  }
}
```

### Validation Rules

```typescript
import type { OmitSetValue, PickSetValue, SetValueOf } from 'typescript-api-pro';

// All validation rules
type AllValidationRules = Set<
  'required' | 'email' | 'minLength' | 'maxLength' | 'pattern'
  | 'numeric' | 'alphanumeric' | 'custom'
>;

type ValidationRule = SetValueOf<AllValidationRules>;

// Basic validation rules (no custom)
type BasicRules = OmitSetValue<AllValidationRules, 'custom'>;

// String-specific rules
type StringRules = PickSetValue<AllValidationRules, 'minLength' | 'maxLength' | 'pattern'>;

// Field validator
class FieldValidator {
  private rules: Set<ValidationRule> = new Set();
  private customValidator?: (value: any) => boolean;

  addRule(rule: ValidationRule): this {
    this.rules.add(rule);
    return this;
  }

  removeRule(rule: ValidationRule): this {
    this.rules.delete(rule);
    return this;
  }

  setCustomValidator(validator: (value: any) => boolean): this {
    this.customValidator = validator;
    this.rules.add('custom');
    return this;
  }

  validate(value: any, options: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  } = {}): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required validation
    if (this.rules.has('required') && (!value || value === '')) {
      errors.push('Field is required');
    }

    // Skip other validations if value is empty and not required
    if (!value && !this.rules.has('required')) {
      return { isValid: true, errors: [] };
    }

    // Email validation
    if (this.rules.has('email')) {
      const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push('Invalid email format');
      }
    }

    // Length validations
    if (this.rules.has('minLength') && options.minLength) {
      if (value.length < options.minLength) {
        errors.push(`Minimum length is ${options.minLength}`);
      }
    }

    if (this.rules.has('maxLength') && options.maxLength) {
      if (value.length > options.maxLength) {
        errors.push(`Maximum length is ${options.maxLength}`);
      }
    }

    // Pattern validation
    if (this.rules.has('pattern') && options.pattern) {
      if (!options.pattern.test(value)) {
        errors.push('Value does not match required pattern');
      }
    }

    // Numeric validation
    if (this.rules.has('numeric')) {
      if (Number.isNaN(Number(value))) {
        errors.push('Value must be numeric');
      }
    }

    // Alphanumeric validation
    if (this.rules.has('alphanumeric')) {
      const alphanumericRegex = /^[a-z0-9]+$/i;
      if (!alphanumericRegex.test(value)) {
        errors.push('Value must be alphanumeric');
      }
    }

    // Custom validation
    if (this.rules.has('custom') && this.customValidator) {
      if (!this.customValidator(value)) {
        errors.push('Custom validation failed');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  getRules(): ValidationRule[] {
    return Array.from(this.rules);
  }

  hasRule(rule: ValidationRule): boolean {
    return this.rules.has(rule);
  }
}
```

## Type Safety Benefits

### Compile-Time Validation

```typescript
import type { SetValueOf } from 'typescript-api-pro';

// Type-safe Set operations
function processSetValues<T extends Set<unknown>>(
  set: T,
  processor: (value: SetValueOf<T>) => void
): void {
  set.forEach((value) => {
    processor(value as SetValueOf<T>);
  });
}

// Usage - TypeScript ensures type safety
const statusSet = new Set(['loading', 'success', 'error'] as const);

processSetValues(statusSet, (status) => {
  console.log(`Processing status: ${status}`);
  // TypeScript knows status is 'loading' | 'success' | 'error'
});
```
