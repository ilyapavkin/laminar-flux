import { LFAction, LFReducer, LFState } from './internal';
interface RouterHandler<S extends LFState = LFState, A extends LFAction = LFAction> {
    (state?: S, action?: A): S;
    add: (reducer: LFReducer<S, A>, actionType?: string, namespace?: string) => void;
    remove: (reducer: LFReducer<S, A>, actionType?: string, namespace?: string) => void;
}
export type { RouterHandler };
