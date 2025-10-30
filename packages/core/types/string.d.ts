type Fmt<T extends string, U extends boolean = false> = U extends true ? Uppercase<T> : Lowercase<T>;

type ToSnakeCase<T extends string, U extends boolean = false> = T extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First> ? `_${Fmt<First, U>}${ToSnakeCase<Rest, U>}`
    : `${Fmt<First, U>}${ToSnakeCase<Rest, U>}`
  : '';

export type Camel2SnakeCase<T extends string, U extends boolean = true> = ToSnakeCase<T, U> extends `_${infer Rest}`
  ? Rest
  : ToSnakeCase<T, U>;
