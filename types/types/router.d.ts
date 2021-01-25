import { Action } from 'typesafe-actions';
import { LFReducer } from './internal';
interface RouterHandler<TState, TAction extends Action> {
    (state: TState, action: TAction): TState;
    add: (actionType: string, reducer: LFReducer, namespace: string) => void;
    remove: (reducer: LFReducer, actionType?: string, namespace?: string) => void;
}
export type { RouterHandler };
