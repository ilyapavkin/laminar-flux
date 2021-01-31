export declare type ConstructorArgs<T> = T extends new (...args: infer A) => never ? A : never;
export declare type Constructor<T extends unknown = unknown> = new (...args: Array<unknown>) => T;
export declare type AnyObject = Record<string, unknown>;
export declare type AnyObjectOrArray = AnyObject | AnyObject[];
export declare type AnyConstructor = Constructor<AnyObject>;
export declare type AnyFunction = (...args: Array<unknown>) => unknown | void;
export declare type Anything = AnyObject | string | number | bigint | boolean | symbol | undefined | null;
