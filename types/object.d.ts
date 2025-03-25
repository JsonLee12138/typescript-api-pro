export type PropertyKey = string | number | symbol;

export type AnyObject<T = any> = Record<PropertyKey, T>;

export type RequiredDependency<T, K extends keyof T, D extends keyof T> = Omit<T, D> & (Partial<{ [P in K | D]: never }> | Required<Pick<T, K | D>>);