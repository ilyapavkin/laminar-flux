import { LFAction, LFPayload } from '../types/internal';
export declare type ModelEffectEndpoint = (action: LFAction) => Promise<LFPayload>;
export declare function effect<TKey extends string, TTarget extends {
    [k in TKey]: ModelEffectEndpoint;
}>(target: TTarget, propertyName: TKey, descriptor: PropertyDescriptor): void;
