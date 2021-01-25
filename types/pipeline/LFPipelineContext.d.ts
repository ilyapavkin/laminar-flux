import { Reducer, Dispatch } from 'redux';
import { LFAction } from '../types/internal';
import { LFPipelineSettings } from './LFPipelineSettings';
export declare const undefinedDispatcher: Dispatch<LFAction>;
export default class LFPipelineContext<A extends LFAction> {
    #private;
    protected router: import("../types/router").RouterHandler<Record<string, unknown>, LFAction<import("../types/common").Anything>>;
    protected dispatcher?: Dispatch<A>;
    protected readonly mainReducer: Reducer;
    constructor(options?: LFPipelineSettings);
    get reducer(): Reducer;
    set dispatch(dispatch: Dispatch<A> | undefined);
    get dispatch(): Dispatch<A> | undefined;
}
