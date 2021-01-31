/* eslint-disable class-methods-use-this */
import { LaminarFluxModel } from 'src/model/LFModel';
import Laminate, { FluxModel } from '../../src/model';
import { attach, reducer /* , effect */ } from '../../src/decorators';
import { LFAction, LFState } from '../../src/types/internal';

const testModelNamespace = 'TestModel';
const testModelStoreReducerActionType = `@@LF:${testModelNamespace}/storeActionReducer`;

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
    */
}

const testModelLaminator = (): InstanceType<LaminarFluxModel> => new (Laminate(TestModel));
type TestModelInstance = ReturnType<typeof testModelLaminator>;

export default TestModel;
export type { TestModelInstance };
export { testModelLaminator };
export {
    testModelNamespace,
    testModelStoreReducerActionType
};
