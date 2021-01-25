import configureMockStore from 'redux-mock-store';
import { getDefaultPipeline } from '../src/api';
import { TestModelInstance, testModelLaminator } from './helpers/testmodel';
import { FluxModelCtl } from '../src/model';


// const middlewares = [];
const mockStore = configureMockStore();
const store = mockStore({});
const pipeline = getDefaultPipeline();
pipeline.dispatch = store.dispatch;
const unarmedPromise = (): void => { throw new Error('Promise was not armed!'); }
let sendPromise: (state: object) => void = unarmedPromise;
const armPromise = (): Promise<object> => new Promise<object>((resolve) => {
    sendPromise = (state: object): void => {
        resolve(state);
        sendPromise = unarmedPromise;
    };
});
store.subscribe(() => {
    const state = store.getState() || {};
    const actions = store.getActions();
    const stateUpdate = actions.map((action) => {
        const res = pipeline.reducer(state, action);
        return res;
    }).reduce((acc, val) => {
        Object.keys(acc).forEach(k => { acc[k] = val });
        return acc;
    }, {});
    if (sendPromise !== unarmedPromise) {
        sendPromise(Object.assign(state, stateUpdate));
    }
});

describe('model reducer methods tests', () => {
    let instance: TestModelInstance;
    const reducerActionType = '@@LF:TestModel/storeActionReducer';
    const reducerNamespace = 'TestModel';   // FIXME: add this check
    const header = {
        type: reducerActionType,
        // namespace: reducerNamespace
    }

    beforeEach(() => {
        instance = testModelLaminator();
    });

    afterEach(() => {
        store.clearActions();
        (instance as unknown as FluxModelCtl).detach();
    });

    test('Reducer method action type', () => {
        expect(instance.storeActionReducer.action.type).toBe(reducerActionType);
    });

    test('Reducer method action generated', () => {
        const payload = { check: 'test' };
        const reality = instance.storeActionReducer.action(payload);
        const expectation = {
            ...header,
            payload
        };
        expect(reality).toEqual(expectation);
    });

    test('Reducer method action sent', () => {
        const payload = { check: 'test' };
        instance.storeActionReducer(payload);
        expect(store.getActions()).toEqual([{ ...header, payload }])
    });

    test('Reducer method state changed', () => {
        const payload = { check: 'test state' };
        armPromise().then(state => {
            expect(state).toEqual({
                TestModel: {
                    storeActionReducer: payload
                }
            })
        });
        instance.storeActionReducer(payload);
    });

    // TODO: MORE TESTS!
});