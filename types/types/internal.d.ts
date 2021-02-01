import { Reducer, Action } from 'typesafe-actions';
import { Anything } from './common';
declare type LFStateValueType = any;
/**
 * Basic redux state object element
 */
export declare type LFStateEntry = Record<string, LFStateValueType>;
/**
 * Basic redux state storage (element or array)
 */
export declare type LFState = any;
/**
 * Basic action
 * @extends Action from `typesafe-actions`
 * @property {string} type - type of action, *derived from `Action`*
 * @property {object} payload - payload of action
 */
export interface LFAction<TData extends Anything = Anything> extends Action {
    payload?: TData;
}
/**
 * Basic reducer. Comply to `Reducer` from `typesafe-actions`.
 */
export declare type LFReducer<TState extends LFState = LFState, TAction extends Action = LFAction> = Reducer<TState, TAction>;
/**
 * FluxModel reducer.
 */
export declare type LFModelReducer<TState extends LFState = LFState, TAction extends Action = LFAction> = LFReducer<TState, TAction>;
/**
 * Basic payload type
 */
export declare type LFPayload = Anything;
export {};
