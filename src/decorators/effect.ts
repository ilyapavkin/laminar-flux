import { LFAction, LFPayload } from '../types/internal';

export type ModelEffectEndpoint = (action: LFAction) => Promise<LFPayload>;

// TODO: implement effects
export function effect<
    TKey extends string,
    TTarget extends { [k in TKey]: ModelEffectEndpoint }
>(target: TTarget, propertyName: TKey, descriptor: PropertyDescriptor) {
}