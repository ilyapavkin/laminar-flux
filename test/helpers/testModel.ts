/* eslint-disable class-methods-use-this */
import Laminate, { FluxModel } from '../../src/model';
import { attach, reducer /* , effect */ } from '../../src/decorators';
import { LFAction, LFState } from '../../src/types/internal';

const testModelNamespace = 'TestModel';
const testModelStoreReducerActionType = `@@LF:${testModelNamespace}/storeActionReducer`;

@attach('Todos')
class Todos extends FluxModel {
    @reducer()
    storeActionReducer(state: LFState, action: LFAction): LFState {
        return { ...state, storeActionReducer: action.payload };
    }

    @reducer()
    addOne(state: LFState, action: LFAction): LFState {
        return { ...state, addOne: action.payload ? action.payload as number + 1 : 0 };
    }


    /* @effect
    async testEffect(action: Action): Promise<LFPayload> {
        return { success: true };
    }
    */
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const testModelLaminator = () => new (Laminate(Todos));
type TestModelInstance = ReturnType<typeof testModelLaminator>;

export default Todos;
export type { TestModelInstance };
export { testModelLaminator };
export {
    testModelNamespace,
    testModelStoreReducerActionType
};
