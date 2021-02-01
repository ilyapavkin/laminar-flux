export type ConstructorArgs<T> = T extends new (...args: infer A) => never ? A : never;
export type Constructor<T extends unknown = unknown> = new (...args: Array<unknown>) => T;

type ObjectKey = string | number | symbol;
export type PlainObject<TKey extends keyof any = string | symbol, TProp = any> = Record<TKey, TProp>;
export type TypeMapArray<TKey extends ObjectKey, TType = any> = TType | Record<TKey, TType> | Array<TType>;

export type Primitive = string | number | bigint | boolean | symbol;
export type AnyPrimitive = TypeMapArray<ObjectKey, Primitive>;
export type PlainObjectOrArray = TypeMapArray<ObjectKey, PlainObject>;

export type AnyConstructor = Constructor<PlainObject>;
export type AnyFunction = (...args: Array<unknown>) => unknown | void;

export type Anything = PlainObject | string | number | bigint | boolean | symbol;

export function isPlainObject(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return false

    let proto = obj
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto)
    }

    return Object.getPrototypeOf(obj) === proto
}