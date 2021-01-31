import { Reducer } from 'redux';
import { LFAction } from 'src/types/internal';
import ActionTypes from './actionTypes';

export function checkReducerValid<S, A extends LFAction>(reducer: Reducer<S, A>, key?: string): S {
    if (typeof reducer !== 'function') {
        throw new Error('Expected the reducer to be a function.');
    }

    const initialState = reducer(undefined, { type: ActionTypes.INIT } as A)
    const name = key === undefined ? '' : `"${key} "`;

    if (typeof initialState === 'undefined') {
        throw new Error(
            `Reducer ${name}returned undefined during initialization. ` +
            'If the state passed to the reducer is undefined, you must ' +
            'explicitly return the initial state. The initial state may ' +
            'not be undefined. If you don\'t want to set a value for this reducer, ' +
            'you can use null instead of undefined.'
        )
    }

    if (
        typeof reducer(undefined, {
            type: ActionTypes.PROBE_UNKNOWN_ACTION()
        } as A) === 'undefined'
    ) {
        throw new Error(
            `Reducer ${name}returned undefined when probed with a random type. ` +
            `Don't try to handle ${ActionTypes.INIT} or other actions in "redux/*" ` +
            'namespace. They are considered private. Instead, you must return the ' +
            'current state for any unknown actions, unless it is undefined, ' +
            'in which case you must return the initial state, regardless of the ' +
            'action type. The initial state may not be undefined, but can be null.'
        )
    }

    return initialState;
}