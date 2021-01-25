export type ConstructorArgs<T> = T extends new (...args: infer A) => never ? A : never;
export type Constructor<T extends unknown = unknown> = new (...args: Array<unknown>) => T;
export type AnyObject = Record<string, unknown>;
export type AnyConstructor = Constructor<AnyObject>;
export type AnyFunction = (...args: Array<unknown>) => unknown | void;
export type Anything = AnyObject | string | number | bigint | boolean | symbol | undefined | null;
