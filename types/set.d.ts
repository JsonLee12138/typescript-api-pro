export type SetValueOf<T extends ReadonlySet<unknown>> = 
  T extends ReadonlySet<infer V> ? V : never;

export type OmitSetValue<T extends Set<unknown>, V extends SetValueOf<T>> = 
  T extends Set<infer Values> ? Set<Exclude<Values, V>> : never;

export type PickSetValue<T extends Set<unknown>, V extends SetValueOf<T>> = Set<V>;

export type ArrayToSet<T extends readonly unknown[]> = Set<T[number]>;

export type SetToArray<T extends ReadonlySet<unknown>> = SetValueOf<T>[];