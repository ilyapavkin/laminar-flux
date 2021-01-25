import configureMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Middleware } from 'redux';
import createSagaMiddleware, { Saga, SagaMiddleware } from 'redux-saga';
import { getDefaultPipeline } from '../../src/api';

export default function configureStore(middlewares?: Middleware[], rootSaga?: Saga, state?: object): MockStoreEnhanced<object> {
    // host:
    // creates decorated store
    // - opt to add reducer to store
    // - opt to add enhancer to store
    // - opt to set store state
    // - opt to add saga to store
    // - opt to add SagaMiddlewareOptions
    // - opt to replace SagaMiddleware
    // - opt to replace reducer
    //
    // guest:
    // attaches to existing store
    // - spawn main reducer and saga


    let enhancements: Middleware[] = [];
    if (rootSaga !== undefined) {
        const sagaMiddleware = createSagaMiddleware();
        enhancements = [sagaMiddleware]
    }

    if (middlewares !== undefined) {
        enhancements = [...enhancements, ...middlewares];
    }

    const pipeline = getDefaultPipeline();

    const mockStore = configureMockStore<object>(enhancements);
    const store = mockStore(state);

    pipeline.dispatch = store.dispatch;

    if (rootSaga !== undefined) {
        const sagaMiddleware = enhancements[0] as SagaMiddleware<object>;
        sagaMiddleware.run(rootSaga);
    }

    return store;
}