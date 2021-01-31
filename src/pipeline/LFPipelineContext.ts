import { Reducer, Dispatch } from 'redux';
import { LFAction, LFState } from '../types/internal';
import LFRouter from '../router';


export const undefinedDispatcher: Dispatch<LFAction> = () => { throw new Error('Undefined reducer name') };

export default class LFPipelineContext<S extends LFState = LFState, A extends LFAction = LFAction> {
    protected router = LFRouter<S, A>();

    protected dispatcher?: Dispatch<A>;

    // #options: LFPipelineSettings = {};

    protected readonly mainReducer: Reducer<S, A> = (state?, action?) => {
        return this.router(state, action);
    }

    /* constructor(options?: LFPipelineSettings) {
        //this.#options = options || {};
    }*/

    get reducer(): Reducer<S, A> {
        return this.mainReducer;
    }

    set dispatch(dispatch: Dispatch<A> | undefined) {
        this.dispatcher = dispatch;
    }

    get dispatch(): Dispatch<A> | undefined {
        return this.dispatcher;
    }
}