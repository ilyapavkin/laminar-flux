import { Reducer, Dispatch } from 'redux';
import { LFAction, LFState } from '../types/internal';
import { LFPipelineSettings } from './LFPipelineSettings';
export declare const undefinedDispatcher: Dispatch<LFAction>;
export default class LFPipelineContext<S extends LFState = LFState, A extends LFAction = LFAction> {
    protected router: import("../types/router").RouterHandler<S, A>;
    protected dispatcher?: Dispatch<A>;
    protected readonly mainReducer: Reducer<S, A>;
    constructor(options?: LFPipelineSettings);
    get reducer(): Reducer<S, A>;
    set dispatch(dispatch: Dispatch<A> | undefined);
    get dispatch(): Dispatch<A> | undefined;
}
