/* eslint-disable import/export */                  // multiple default exports handy here.
/* eslint-disable @typescript-eslint/ban-types */   // mimic `redux` package

import LFPipeline from 'src/pipeline/LFPipeline';
import { Store, StoreEnhancer, PreloadedState, createStore as createStoreProxy } from 'redux';
import { LFReducer, LFAction, LFState } from '../types/internal';
import setDefaultPipeline from './setDefaultPipeline';

type ExtendState<State, Extension> = [Extension] extends [never]
    ? State
    : State & Extension

/**
 * Adopted StoreCreator interface from `redux`
 * This StoreCreator does exactly the same thing, except `reducer` is additional
 * conventional reducer, which will be plugged as combined reducer along side
 * internal one from library. Unlike `redux` StoreCreator all arguments are optional.
 * 
 * In order to provide initial state and/or store enhancer without `reducer` `undefined` should be passed as first parameter
 * 
 * @see {StoreCreator} for more info.
 * 
 * @template S The type of state to be held by the store. Extends `LFState`
 * @template A The type of actions which may be dispatched. Extends `LFAction`
 * @template Ext Store extension that is mixed in to the Store type.
 * @template StateExt State extension that is mixed into the state type.
 * 
 * @example
 * ```typescript
 * const store = createStore();     // default automatic empty store
 * ```
 * @example
 * ```typescript
 * const store = createStore(undefined, { Hello: 1 });  // default automatic store with initial state
 * ```
 * @example
 * ```typescript
 * const enhancer = applyMiddleware(...middlewares);
 * const store = createStore(undefined, enhancer);      // default automatic store with enhancer
 * ```
 * @example
 * ```typescript
 * const reducer = combineReducers(reducers);                   // vanilla combineReducer from redux
 * const enhancer = applyMiddleware(...middlewares);
 * const store = createStore(reducer, { Hello: 1 }, enhancer);  // default automatic store with plugged-in combined reducer, initial state and enhancer
 * ```
 */
export interface StoreCreator {
    <S extends LFState, A extends LFAction, Ext, StateExt>(
        reducer?: LFReducer<S, A>,
        enhancer?: StoreEnhancer<Ext, StateExt>
    ): Store<S & StateExt, A> & Ext
    <S extends LFState, A extends LFAction, Ext, StateExt>(
        reducer?: LFReducer<S, A>,
        preloadedState?: PreloadedState<S>,
        enhancer?: StoreEnhancer<Ext>
    ): Store<S & StateExt, A> & Ext
}

// TODO: better host/guest modes

/**
 * Adopted from `redux`, creates a Redux store that holds the state tree.
 * ~~Function is intended to be used in host mode only.~~ (WIP on that one)
 * 
 * @param reducer 
 * @param preloadedState
 * @param enhancer
 */
export default function createStore<
    S extends LFState,
    A extends LFAction,
    Ext = {},
    StateExt = never
>(
    reducer?: LFReducer<S, A>,
    enhancer?: StoreEnhancer<Ext, StateExt>
): Store<ExtendState<S, StateExt>, A> & Ext
export default function createStore<
    S extends LFState,
    A extends LFAction,
    Ext = {},
    StateExt = never
>(
    enhancer?: StoreEnhancer<Ext>
): Store<ExtendState<S, StateExt>, A> & Ext
export default function createStore<
    S extends LFState,
    A extends LFAction,
    Ext = {},
    StateExt = never
>(
    reducer?: LFReducer<S, A>,
    preloadedState?: PreloadedState<S> | StoreEnhancer<Ext, StateExt>,
    enhancer?: StoreEnhancer<Ext>
): Store<ExtendState<S, StateExt>, A> & Ext
export default function createStore<
    S extends LFState,
    A extends LFAction,
    Ext = {},
    StateExt = never
>(
    reducer?: LFReducer<S, A>,
    preloadedState?: PreloadedState<S>,
    enhancer?: StoreEnhancer<Ext, StateExt>
): Store<ExtendState<S, StateExt>, A> & Ext {

    // const defaultPipeline = getDefaultPipeline<S, A>() as LFPipelineContext<S, A>;
    const defaultPipeline = new LFPipeline<S, A>();
    // If user defines reducer - plug laminar after it.
    if (reducer !== undefined) {
        defaultPipeline.attach(reducer);
    }

    if (
        (typeof preloadedState === 'function' && typeof enhancer === 'function') ||
        // eslint-disable-next-line prefer-rest-params
        (typeof enhancer === 'function' && typeof arguments[3] === 'function')
    ) {
        throw new Error(
            'It looks like you are passing several store enhancers to ' +
            'createStore(). This is not supported. Instead, compose them ' +
            'together to a single function.'
        )
    }

    const store = createStoreProxy(defaultPipeline.reducer, preloadedState, enhancer) as Store<ExtendState<S, StateExt>, A> & Ext;
    defaultPipeline.dispatch = store.dispatch;
    setDefaultPipeline(defaultPipeline);

    return store;
}