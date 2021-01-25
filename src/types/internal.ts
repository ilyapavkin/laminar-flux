import { Reducer, Action } from 'typesafe-actions';
import { AnyObject, Anything } from './common';

type LFStateValueType = unknown;

type GetAction<TAction extends Action, TType extends TAction['type']> = TAction extends Action<TType> ? TAction : never;
type InitialHandler<TState, TRootAction extends Action> = {
    [P in TRootAction['type']]?: (state: TState, action: GetAction<TRootAction, P>) => TState;
};

/**
 * Basic redux state object
 */
export type LFState = Record<string, LFStateValueType>;
/**
 * Basic action
 * @extends Action from `typesafe-actions`
 * @property {string} type - type of action, *derived from `Action`*
 * @property {object} payload - payload of action
 */
export type LFAction<TData extends Anything = Anything> = Action & {
    payload?: TData;
};
/**
 * Basic reducer. Comply to `Reducer` from `typesafe-actions`.
 */
export type LFReducer<TState extends LFState = LFState, TAction extends Action = LFAction> = Reducer<TState, TAction>;
/**
 * FluxModel reducer.
 */
export type LFModelReducer = LFReducer & Readonly<{ handlers?: InitialHandler<AnyObject, Action> }>;
/**
 * Basic payload type
 */
export type LFPayload = AnyObject;