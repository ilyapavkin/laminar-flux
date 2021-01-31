export type ConstructorArgs<T> = T extends new (...args: infer A) => never ? A : never;
export type Constructor<T extends unknown = unknown> = new (...args: Array<unknown>) => T;
export type PlainObject = Record<string, unknown>;
export type PlainObjectOrArray = PlainObject | PlainObject[];
export type AnyConstructor = Constructor<PlainObject>;
export type AnyFunction = (...args: Array<unknown>) => unknown | void;
export type Anything = PlainObject | string | number | bigint | boolean | symbol | undefined | null;

export function isPlainObject(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return false

    let proto = obj
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto)
    }

    return Object.getPrototypeOf(obj) === proto
}