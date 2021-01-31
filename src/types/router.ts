import { LFAction, LFReducer, LFState } from './internal';

interface RouterHandler<S extends LFState = LFState, A extends LFAction = LFAction> {
    (state?: S, action?: A): S;
    add: (reducer: LFReducer<S, A>, namespace?: string, actionType?: string) => void;
    remove: (reducer: LFReducer<S, A>, namespace?: string, actionType?: string) => void;
    // onUpdate: () => void
}

export type { RouterHandler };
