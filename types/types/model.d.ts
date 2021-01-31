import { TypeConstant, PayloadActionCreator } from 'typesafe-actions';
import { Dispatch } from 'redux';
import { AnyFunction } from './common';
import { LFReducer, LFPayload, LFAction, LFState } from './internal';
/**
 * FluxModel call handler. (not implemented yet)
 */
export declare type LFCallHandle = {
    cancel: () => void;
};
export declare type ModelMethodDecorationExtension = PayloadActionCreator<TypeConstant, LFPayload> & {
    type: TypeConstant;
    namespace?: string;
};
export declare type DispatchAttribute = {
    action: ModelMethodDecorationExtension;
    dispatch?: Dispatch;
};
export declare type ModelDispathableMethod = AnyFunction & DispatchAttribute;
export declare type ModelSyncEndpoint<S extends LFState = LFState, A extends LFAction = LFAction> = LFReducer<S, A>;
export declare type ModelAsyncEndpoint<A extends LFAction = LFAction> = (action: A) => Promise<LFPayload>;
export declare type ModelEndpoint<S extends LFState = LFState, A extends LFAction = LFAction> = ModelSyncEndpoint<S, A> | ModelAsyncEndpoint<A>;
