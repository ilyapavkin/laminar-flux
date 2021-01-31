import { Reducer, Dispatch } from 'redux';
import { LFAction, LFState } from '../types/internal';
export declare const undefinedDispatcher: Dispatch<LFAction>;
export default class LFPipelineContext<S extends LFState = LFState, A extends LFAction = LFAction> {
    protected router: import("../types/router").RouterHandler<S, A>;
    protected dispatcher?: Dispatch<A>;
    protected readonly mainReducer: Reducer<S, A>;
    get reducer(): Reducer<S, A>;
    set dispatch(dispatch: Dispatch<A> | undefined);
    get dispatch(): Dispatch<A> | undefined;
}
