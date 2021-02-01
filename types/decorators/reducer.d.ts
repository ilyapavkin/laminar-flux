import { Anything } from 'src/types/common';
import { LFState, LFAction, LFPayload } from '../types/internal';
import { DispatchAttribute } from '../types/model';
declare type GenericModelReducerEndpoint<TData extends Anything = Anything> = (state: LFState, action: LFAction<TData>) => LFState;
export declare type ModelReducerEndpoint = (state: LFState, action: LFAction<any>) => LFState;
export interface ModelReducerDecorator extends DispatchAttribute {
    (payload: LFPayload): LFState;
}
export declare function rdcr(): <TKey extends string, TTarget extends { [K in TKey]: GenericModelReducerEndpoint<Anything>; }>(target: TTarget, propertyName: TKey, descriptor: PropertyDescriptor) => void;
export declare function reducer<TKey extends string, TTarget extends {
    [K in TKey]: ModelReducerEndpoint;
}>(target: TTarget, propertyName: TKey, descriptor: PropertyDescriptor): void;
export {};
