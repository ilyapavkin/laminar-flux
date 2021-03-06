import { AnyAction } from 'redux';
import { Reducer, Action } from 'typesafe-actions';
import { PlainObject, Anything, AnyPrimitive } from './common';

type LFStateValueType = any;
/**
 * Basic redux state storage (element or array)
 */
export type LFState<TState extends LFStateValueType = LFStateValueType> = TState;

/**
 * A message is a extension over *redux* `Action`. 
 */
export interface LFMessage<TPayload extends AnyPrimitive = AnyPrimitive> extends Action {
    payload?: TPayload;
}

/*type GetAction<TAction extends Action, TType extends TAction['type']> = TAction extends Action<TType> ? TAction : never;
type InitialHandler<TState, TRootAction extends Action> = {
    [P in TRootAction['type']]?: (state: TState, action: GetAction<TRootAction, P>) => TState;
};*/

/**
 * Basic action
 * @extends Action from `typesafe-actions`
 * @property {string} type - type of action, *derived from `Action`*
 * @property {object} payload - payload of action
 */
export interface LFAction<TData extends Anything = Anything> extends Action {
    payload?: TData;
}
// export type LFAction<TData extends Anything = Anything> = Action & Omit<TData, 'type'>;

/**
 * Basic reducer. Comply to `Reducer` from `typesafe-actions`.
 */
export type LFReducer<TState extends LFState = LFState, TAction extends Action = LFAction> = Reducer<TState, TAction>;
/**
 * FluxModel reducer.
 */
//export type LFModelReducer = LFReducer & Readonly<{ handlers?: InitialHandler<AnyObject, Action> }>;
export type LFModelReducer<TState extends LFState = LFState, TAction extends Action = LFAction> = LFReducer<TState, TAction>;
/**
 * Basic payload type
 */
export type LFPayload = Anything;