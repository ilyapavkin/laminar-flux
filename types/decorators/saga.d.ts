import { LFAction } from '../types/internal';
export declare type ModelSagaEndpoint = (action: LFAction) => Generator;
export declare function saga<TKey extends string, TTarget extends {
    [k in TKey]: ModelSagaEndpoint;
}>(target: TTarget, propertyName: TKey, descriptor: PropertyDescriptor): void;
