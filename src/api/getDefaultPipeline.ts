import { LFAction } from '../types/internal';
import LFPipeline/* , { LFPipelineSettings }*/ from '../pipeline';

let defaultPipeline: LFPipeline;

// FIXME: figure that out
export function getDefaultPipeline<A extends LFAction = LFAction>(/* options?: LFPipelineSettings*/): LFPipeline<A> {
    if (defaultPipeline === undefined) {
        defaultPipeline = new LFPipeline(/* options || {}*/);
    }
    return defaultPipeline;
}