import { LFAction, LFState } from '../types/internal';
import LFPipeline/* , { LFPipelineSettings }*/ from '../pipeline';

let defaultPipeline: unknown;

// FIXME: figure options out
export function getDefaultPipeline<S extends LFState = LFState, A extends LFAction = LFAction>(/* options?: LFPipelineSettings*/): LFPipeline<S, A> {
    if (defaultPipeline === undefined) {
        defaultPipeline = new LFPipeline<S, A>(/* options || {}*/);
    }
    return defaultPipeline as LFPipeline<S, A>;
}