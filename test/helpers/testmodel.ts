/* eslint-disable class-methods-use-this */
import Laminate, { FluxModel } from '../../src/model';
import { attach, reducer /* , effect, saga */ } from '../../src/decorators';
import { LFAction, LFState } from '../../src/types/internal';

@attach()
class TestModel extends FluxModel {
    @reducer
    storeActionReducer(state: LFState, action: LFAction): LFState {
        return { ...state, storeActionReducer: action.payload };
    }

    @reducer
    addOne(state: LFState, action: LFAction): LFState {
        return { ...state, addOne: action.payload ? action.payload as number + 1 : 0 };
    }


    /* @effect
    async testEffect(action: Action): Promise<LFPayload> {
        return { success: true };
    }

    @saga
    *testSaga(action: Action): Generator {
        return { success: true }
    } */
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const testModelLaminator = () => new (Laminate(TestModel));
type TestModelInstance = ReturnType<typeof testModelLaminator>;

export default TestModel;
export type { TestModelInstance };
export { testModelLaminator };
