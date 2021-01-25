import { LFState, LFAction, LFPayload } from '../types/internal';
import { DispatchAttribute } from '../types/model';
export declare type ModelReducerEndpoint = (state: LFState, action: LFAction) => LFState;
export interface ModelReducerDecorator extends DispatchAttribute {
    (payload: LFPayload): LFState;
}
export declare function reducer<TKey extends string, TTarget extends {
    [K in TKey]: ModelReducerEndpoint;
}>(target: TTarget, propertyName: TKey, descriptor: PropertyDescriptor): void;
