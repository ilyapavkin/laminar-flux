/* eslint-disable import/export */                  // multiple default exports handy here.
/* eslint-disable @typescript-eslint/ban-types */   // mimic `redux` package

import { Store, StoreEnhancer, PreloadedState, createStore as createStoreProxy } from 'redux';
import LFPipelineContext from 'src/pipeline/LFPipelineContext';
import { LFReducer, LFAction, LFState } from '../types/internal';
import { getDefaultPipeline } from './getDefaultPipeline'

type ExtendState<State, Extension> = [Extension] extends [never]
    ? State
    : State & Extension

/**
 * Adopted StoreCreator interface from `redux`
 * This StoreCreator does exactly the same thing, except `reducer` is additional
 * conventional reducer, which will be plugged as combined reducer along side
 * internal one from library. Unlike `redux` StoreCreator all arguments are optional.
 * 
 * @see {@link StoreCreator} for more info.
 * 
 * @template S The type of state to be held by the store. Extends `LFState`
 * @template A The type of actions which may be dispatched. Extends `LFAction`
 * @template Ext Store extension that is mixed in to the Store type.
 * @template StateExt State extension that is mixed into the state type.
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

/**
 * Adopted from `redux`, creates a Redux store that holds the state tree.
 * Function is intended to be used in host mode only.
 * 
 * @param reducer 
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

    const defaultPipeline = getDefaultPipeline() as LFPipelineContext<A>;
    const rootReducer = reducer !== undefined ? reducer : defaultPipeline.reducer;

    const store = createStoreProxy(rootReducer, preloadedState, enhancer) as Store<ExtendState<S, StateExt>, A> & Ext;
    defaultPipeline.dispatch = store.dispatch;

    return store;
}