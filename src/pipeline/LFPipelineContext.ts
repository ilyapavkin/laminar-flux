import { Reducer, Dispatch } from 'redux';
import { LFAction } from '../types/internal';
import LFRouter from '../router';
import { LFPipelineSettings } from './LFPipelineSettings';


export const undefinedDispatcher: Dispatch<LFAction> = () => { throw new Error('Undefined reducer name') };

export default class LFPipelineContext<A extends LFAction> {
    protected router = LFRouter();

    protected dispatcher?: Dispatch<A>;

    #options: LFPipelineSettings = {};

    protected readonly mainReducer: Reducer = (state, action) => {
        return this.router(state, action);
    }

    constructor(options?: LFPipelineSettings) {
        this.#options = options || {};
    }

    get reducer(): Reducer {
        return this.mainReducer;
    }

    set dispatch(dispatch: Dispatch<A> | undefined) {
        this.dispatcher = dispatch;
    }

    get dispatch(): Dispatch<A> | undefined {
        return this.dispatcher;
    }
}