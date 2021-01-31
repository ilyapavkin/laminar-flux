// import { createStoreContent } from '../../helpers/store';

import {
    combineReducers
} from 'redux';
import {
    createStore,
} from '..';


import {
    addTodo,
    dispatchInMiddle,
    getStateInMiddle,
    subscribeInMiddle,
    unsubscribeInMiddle,
    throwError,
    unknownAction
} from './redux/test/helpers/actionCreators'

import * as reducers from './redux/test/helpers/reducers';

describe('createStoreLegacy', () => {
    it('allows automatic reducer', () => {
        // Unlike regular redux store - laminar-flux creates it's own reducer if none provided.
        expect(() => createStore()).not.toThrow();
    });

    it('passes the initial state', () => {
        const store = createStore(undefined, {
            id: 1,
            text: 'Hello'
        });

        expect(store.getState()).toEqual({
            id: 1,
            text: 'Hello'
        });
    });

    it('applies the reducer to the previous state', () => {
        const store = createStore(combineReducers({ todos: reducers.todos }));

        expect(store.getState()).toEqual({
            todos: []
        });

        store.dispatch(unknownAction());
        expect(store.getState()).toEqual({
            todos: []
        });

        store.dispatch(addTodo('Hello'))
        expect(store.getState()).toEqual({
            todos: [
                {
                    id: 1,
                    text: 'Hello'
                }
            ]
        });

        store.dispatch(addTodo('World'))
        expect(store.getState()).toEqual({
            todos: [
                {
                    id: 1,
                    text: 'Hello'
                },
                {
                    id: 2,
                    text: 'World'
                }
            ]
        })
    })

    it('applies the reducer to the initial state', () => {
        const store = createStore(combineReducers({ todos: reducers.todos }), {
            todos: [
                {
                    id: 1,
                    text: 'Hello'
                }
            ]
        });

        expect(store.getState()).toEqual({
            todos: [
                {
                    id: 1,
                    text: 'Hello'
                }
            ]
        });

        store.dispatch(unknownAction())
        expect(store.getState()).toEqual({
            todos:
                [
                    {
                        id: 1,
                        text: 'Hello'
                    }
                ]
        });

        store.dispatch(addTodo('World'))
        expect(store.getState()).toEqual({
            todos: [
                {
                    id: 1,
                    text: 'Hello'
                },
                {
                    id: 2,
                    text: 'World'
                }
            ]
        })
    });
})
