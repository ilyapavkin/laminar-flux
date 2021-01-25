import { TypeConstant, PayloadActionCreator } from 'typesafe-actions';
import { Dispatch } from 'redux';
import { AnyFunction } from './common';
import { LFReducer, LFPayload, LFAction } from './internal';
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
export declare type ModelSyncEndpoint = LFReducer;
export declare type ModelAsyncEndpoint = (action: LFAction) => Promise<LFPayload>;
export declare type ModelEndpoint = ModelSyncEndpoint | ModelAsyncEndpoint;
