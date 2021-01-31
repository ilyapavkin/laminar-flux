import { MockStore } from 'redux-mock-store';
import { Pipeline } from '../..';
import { PlainObject } from '../../src/types/common';

const unarmedPromise = (): void => { throw new Error('Promise was not armed!'); }

const armPromise = (store: MockStore, pipeline: Pipeline): Promise<PlainObject> => new Promise<PlainObject>((resolve) => {
    let sendPromise: (state: PlainObject) => void = unarmedPromise;
    const unsubscribe = store.subscribe(() => {
        const state = store.getState() || {};
        const actions = store.getActions();
        const stateUpdate = actions.map((action) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = pipeline.reducer(state, action) as any;
            return res;
        }).reduce((acc, val) => {
            Object.keys(acc).forEach(k => { acc[k] = val });
            return acc;
        }, {});
        if (sendPromise !== unarmedPromise) {
            sendPromise(Object.assign(state, stateUpdate));
        }
    });

    sendPromise = (state: PlainObject): void => {
        resolve(state);
        unsubscribe();
        sendPromise = unarmedPromise;
    };
});

export { armPromise };