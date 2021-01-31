// Model implementation of TODOS reducer

/* eslint-disable class-methods-use-this */
import { LaminarFluxModel } from '../../src/model/LFModel';
import { Laminate, FluxModel, attach, reducer /* , effect */ } from '../..';
import { LFAction, LFState } from '../../src/types/internal';

// FIXME: should be part of FluxModelCtl
const todosModelNamespace = 'TodosModel';
const todosModelStoreReducerActionType = `@@LF:${todosModelNamespace}/storeActionReducer`;

@attach()
class TodosModel extends FluxModel {
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


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const todosModelLaminator = () => new (Laminate(TodosModel));
type TodosModelInstance = ReturnType<typeof todosModelLaminator>;

export default TodosModel;
export type { TodosModelInstance };
export { todosModelLaminator };
export {
    todosModelNamespace,
    todosModelStoreReducerActionType
};
