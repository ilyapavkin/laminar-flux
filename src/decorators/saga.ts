import { LFAction, LFPayload } from '../types/internal';

export type ModelSagaEndpoint = (action: LFAction) => Generator;

export function saga<
    TKey extends string,
    TTarget extends { [k in TKey]: ModelSagaEndpoint }
>(target: TTarget, propertyName: TKey, descriptor: PropertyDescriptor) {
}