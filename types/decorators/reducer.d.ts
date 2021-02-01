import { AnyPrimitive } from '../types/common';
import { LFState, LFAction, LFPayload } from '../types/internal';
import { ModelMethodActionAttribute, ModelMethodDispatchAttribute } from '../types/model';
export declare type GenericModelReducerEndpoint<TState, TData, TFunc extends (state: TState, action: LFAction<TData>) => TState> = TFunc;
declare type ModelReducer = ModelMethodDispatchAttribute & ModelMethodActionAttribute;
export declare type ModelReducerEndpoint<TState extends LFState = LFState, TData = LFPayload> = (state: TState, action: LFAction<TData>) => TState;
export interface ModelReducerDecorator<TState extends LFState = LFState, TData = LFPayload> extends ModelReducer {
    (payload: TData): TState;
}
export declare function reducer<TState extends LFState = LFState, TData extends AnyPrimitive = AnyPrimitive>(): <TKey extends string, TTarget extends { [K in TKey]: TTarget[K]; }>(target: TTarget, propertyName: TKey, descriptor: PropertyDescriptor) => void;
export {};
