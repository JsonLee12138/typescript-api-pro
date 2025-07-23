export type SetValueOf<T extends Set<any>> = T extends Set<infer V> ? V : never;

export type OmitSetValue<T extends Set<any>, V extends SetValueOf<T>> = 
  T extends Set<infer Values> ? Set<Exclude<Values, V>> : never;

export type PickSetValue<T extends Set<any>, V extends SetValueOf<T>> = Set<V>;

export type ArrayToSet<T extends any[]> = Set<T[number]>;

export type SetToArray<T extends Set<any>> = SetValueOf<T>[];