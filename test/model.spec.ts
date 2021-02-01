import configureMockStore from 'redux-mock-store';
import { TodosModelInstance, todosModelLaminator } from './models/todos';
import { createStore, FluxModelCtl, getDefaultPipeline, dropPipeline } from '..';

import {
    addTodo,
    dispatchInMiddle,
    getStateInMiddle,
    subscribeInMiddle,
    unsubscribeInMiddle,
    throwError,
    unknownAction
} from './redux/test/helpers/actionCreators'

describe('model reducer methods tests', () => {
    let instance: TodosModelInstance;
    const reducerActionType = '@@LF:TodosModel/storeActionReducer';
    const header = {
        type: reducerActionType,
        // namespace: reducerNamespace
    }

    beforeEach(() => {
        // reset model instance
        // instance = todosModelLaminator();
    });

    afterEach(() => {
        // store.clearActions();
        // drop model from pipeline, will be reattached on next test
        (instance as unknown as FluxModelCtl).detach();
        dropPipeline('default');
    });

    test('Reducer method action type', () => {
        instance = todosModelLaminator();
        expect(instance.storeActionReducer.action.type).toBe(reducerActionType);
    });

    test('Reducer method action generated', () => {
        instance = todosModelLaminator();
        const payload = { check: 'test' };
        const reality = instance.storeActionReducer.action(payload);
        const expectation = {
            ...header,
            payload
        };
        expect(reality).toEqual(expectation);
    });

    test('Reducer method action sent', () => {
        const mockStore = configureMockStore();
        const store = mockStore({});
        const pipeline = getDefaultPipeline();
        instance = todosModelLaminator();
        pipeline.dispatch = store.dispatch;

        const payload = { check: 'test' };
        instance.storeActionReducer(payload);
        expect(store.getActions()).toEqual([{ ...header, payload }])
    });

    test('Reducer method state changed', () => {
        const store = createStore();
        instance = todosModelLaminator();

        const payload = { check: 'test state' };
        instance.storeActionReducer(payload);

        expect(store.getState()).toEqual({
            TodosModel: {
                storeActionReducer: payload
            }
        });
    });

    it('applies the reducer to the previous state', () => {
        const store = createStore();
        instance = todosModelLaminator();

        expect(store.getState()).toEqual({
            // TodosModel: []
        });

        store.dispatch(unknownAction());
        expect(store.getState()).toEqual({
            // TodosModel: []
        });

        instance.add({
            text: 'Hello'
        });
        expect(store.getState()).toEqual({
            TodosModel: [
                {
                    id: 1,
                    text: 'Hello'
                }
            ]
        });

        instance.add({
            text: 'World'
        });
        expect(store.getState()).toEqual({
            TodosModel: [
                {
                    id: 1,
                    text: 'Hello'
                },
                {
                    id: 2,
                    text: 'World'
                }
            ]
        });
    })

    it('applies the reducer to the initial state', () => {
        const store = createStore(undefined, {
            TodosModel: [
                {
                    id: 1,
                    text: 'Hello'
                }
            ]
        });
        instance = todosModelLaminator();

        expect(store.getState()).toEqual({
            TodosModel: [
                {
                    id: 1,
                    text: 'Hello'
                }
            ]
        });

        store.dispatch(unknownAction())
        expect(store.getState()).toEqual({
            TodosModel:
                [
                    {
                        id: 1,
                        text: 'Hello'
                    }
                ]
        });

        instance.add({
            text: 'World'
        });
        expect(store.getState()).toEqual({
            TodosModel: [
                {
                    id: 1,
                    text: 'Hello'
                },
                {
                    id: 2,
                    text: 'World'
                }
            ]
        });
    });

    // TODO: MORE TESTS!
});