import { TypeConstant, PayloadActionCreator } from 'typesafe-actions';
import { Dispatch } from 'redux';

import { AnyFunction } from './common';
import { LFReducer, LFPayload, LFAction } from './internal';

/**
 * FluxModel call handler. (not implemented yet)
 */
// TODO: implement this:
export type LFCallHandle = {
    cancel: () => void;
};

// export type ModelMethodActionBuilderPayloadCreator = (payload: object[]) => void;
/* export type ModelMethodActionBuilder = ((
    payload: object[]
) => ActionBuilder<string, ModelMethodActionBuilderPayloadCreator> /* {
    type: TypeConstant;
    payload?: object[];
} * /) & { type: TypeConstant }; */
// type ModelMethodActionBuilder = PayloadActionCreator<TypeConstant, LFPayload[]> & { type: TypeConstant };
export type ModelMethodDecorationExtension = PayloadActionCreator<TypeConstant, LFPayload> & { type: TypeConstant, namespace?: string };

/* export interface ModelMethod {
    (...args: LFPayload[]): ModelMethodCallHandle; // dispatch message with payload
    action: ModelMethodActionBuilder;                   // get raw action without dispatching
}*/

export type DispatchAttribute = {
    action: ModelMethodDecorationExtension; // get raw action without dispatching
    dispatch?: Dispatch;                    // on runtime dispatch will be assigned
}
export type ModelDispathableMethod = AnyFunction & DispatchAttribute;

export type ModelSyncEndpoint = LFReducer;
export type ModelAsyncEndpoint = (action: LFAction) => Promise<LFPayload>;
export type ModelEndpoint = ModelSyncEndpoint | ModelAsyncEndpoint;

// TODO: implement following:
/*
type ModelEndpointHandlers = {
    success?: ModelSyncEndpoint,
    failure?: ModelSyncEndpoint,
    cancel?: ModelSyncEndpoint
};
type ModelEndpointMap = Record<string, ModelEndpointHandlers>;
type ModelEndpointConfig = {
    onRequest?: ModelSyncEndpoint;
    onPending?: ModelSyncEndpoint;
    onComplete?: ModelSyncEndpoint;
    onSuccess?: ModelSyncEndpoint;
    onFailure?: ModelSyncEndpoint;
    onCanceled?: ModelSyncEndpoint;
    isCancelable?: boolean;
};
*/
