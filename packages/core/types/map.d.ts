import type { AnyObject } from './object';

export type MapKeyOf<T extends Map<unknown, unknown>> = T extends Map<infer K, unknown> ? K : never;

export type MapValueOf<T extends Map<unknown, unknown>> = T extends Map<unknown, infer V> ? V : never;

export type MapToObject<T extends Map<unknown, unknown>> = {
  [K in MapKeyOf<T> & PropertyKey]: T extends Map<unknown, infer V> ? V : never;
};

export type ObjectToMap<T extends AnyObject> = Map<keyof T, T[keyof T]>;

export type OmitMapKey<T extends Map<unknown, unknown>, K extends MapKeyOf<T>> = T extends Map<infer Keys, infer V> ? Map<Exclude<Keys, K>, V> : never;

export type PickMapKey<T extends Map<unknown, unknown>, K extends MapKeyOf<T>> = T extends Map<unknown, infer V> ? Map<K, V> : never;
