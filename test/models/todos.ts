// Model implementation of TODOS reducer

/* eslint-disable class-methods-use-this */
import { Laminate, State, Action, FluxModel, attach, reducer, rdcr /* , effect */ } from '../..';

// FIXME: should be part of FluxModelCtl
const todosModelNamespace = 'TodosModel';
const todosModelStoreReducerActionType = `@@LF:${todosModelNamespace}/storeActionReducer`;

function id(state: { id: number }[]) {
    return (
        state.reduce((result, item) => (item.id > result ? item.id : result), 0) + 1
    )
}


@attach()
class TodosModel extends FluxModel {
    @reducer
    storeActionReducer(state: State, action: Action): State {
        return { ...state, storeActionReducer: action.payload };
    }

    @reducer
    add(state: State = [], action: Action<{
        id: number,
        text: string
    }>): State {
        return [
            ...state,
            {
                id: id(state as { id: number }[]),
                text: action.payload?.text
            }
        ];
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