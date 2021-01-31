import { Reducer, Dispatch } from 'redux';
import { trace } from '../utils/trace';
import { LFAction, LFState } from '../types/internal';
import LFRouter from '../router';
import { LFPipelineSettings } from './LFPipelineSettings';


export const undefinedDispatcher: Dispatch<LFAction> = () => { throw new Error('Undefined reducer name') };

export default class LFPipelineContext<S extends LFState = LFState, A extends LFAction = LFAction> {
    protected router = LFRouter<S, A>();

    protected dispatcher?: Dispatch<A>;

    // #options: LFPipelineSettings = {};

    protected readonly mainReducer: Reducer<S, A> = (state?, action?) => {
        return this.router(state, action);
    }

    constructor(options?: LFPipelineSettings) {
        trace('LFPipeline constructed!', options);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        trace('table:', this.router.getTable());
        // this.#options = options || {};
    }

    get reducer(): Reducer<S, A> {
        return this.mainReducer;
    }

    set dispatch(dispatch: Dispatch<A> | undefined) {
        trace('dispatch set in pipeline', dispatch);
        this.dispatcher = dispatch;
    }

    get dispatch(): Dispatch<A> | undefined {
        trace('getter called for dispatch', this.dispatcher);
        return this.dispatcher;
    }
}