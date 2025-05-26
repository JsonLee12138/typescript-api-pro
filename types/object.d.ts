export type PropertyKey = string | number | symbol;

export type AnyObject<T = any> = Record<PropertyKey, T>;

export type RequiredDependency<T extends AnyObject, K extends keyof T, D extends keyof T> = Omit<T, D> & (Partial<{ [P in K | D]: never }> | Required<Pick<T, K | D>>);

export type MutuallyWithObject<T extends AnyObject> = {
  [K in keyof T]: { [P in K]: T[K] } & { [P in Exclude<keyof T, K>]?: never };
}[keyof T]

export type Mutually<T extends AnyObject, K extends keyof T, O extends keyof T> = Omit<T, K> | Omit<T, O>;

export type Generic<R extends AnyObject, K extends keyof R, T> = Omit<R, K> & { [P in K]: T };

export type OmitByObject<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
