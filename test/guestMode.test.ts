import configureStore from './helpers/configureGuestStore';
import { TestModelInstance, testModelLaminator } from './helpers/testmodel';

const store = configureStore();

describe('model reducer methods tests', () => {
    let instance: TestModelInstance;
    // let loader;
    const reducerActionType = '@@LF:TestModel/storeActionReducer';
    const reducerNamespace = 'TestModel';   // FIXME: add check
    const header = {
        type: reducerActionType,
        // namespace: reducerNamespace
    }

    beforeEach(() => {
        instance = testModelLaminator();
        // loader = new ModelLoader();
        // loader.attach(instance);
        // loader.bind(store.dispatch);
    });

    afterEach(() => {
        store.clearActions();
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
});