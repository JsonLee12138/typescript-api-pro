import type { AnyObject } from './object'

export type MapKeyOf<T extends Map<any, any>> = T extends Map<infer K, any> ? K : never;

export type MapValueOf<T extends Map<any, any>> = T extends Map<any, infer V> ? V : never;

export type MapToObject<T extends Map<any, any>> = {
    [K in MapKeyOf<T> & PropertyKey]: T extends Map<any, infer V> ? V : never;
};
 
export type ObjectToMap<T extends AnyObject> = Map<keyof T, T[keyof T]>;

export type OmitMapKey<T extends Map<any, any>, K extends MapKeyOf<T>> = 
  T extends Map<infer Keys, infer V> ? Map<Exclude<Keys, K>, V> : never;

export type PickMapKey<T extends Map<any, any>, K extends MapKeyOf<T>> = 
  T extends Map<any, infer V> ? Map<K, V> : never;