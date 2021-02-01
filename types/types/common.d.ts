export declare type ConstructorArgs<T> = T extends new (...args: infer A) => never ? A : never;
export declare type Constructor<T extends unknown = unknown> = new (...args: Array<unknown>) => T;
export declare type PlainObject = Record<string, unknown>;
export declare type PlainObjectOrArray = PlainObject | PlainObject[];
export declare type AnyConstructor = Constructor<PlainObject>;
export declare type AnyFunction = (...args: Array<unknown>) => unknown | void;
export declare type Anything = PlainObject | string | number | bigint | boolean | symbol | undefined;
export declare function isPlainObject(obj: any): boolean;
