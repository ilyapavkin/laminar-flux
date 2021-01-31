import { LFAction, LFState } from '../types/internal';
import LFPipeline, { LFPipelineSettings, getPipelineByName } from '../pipeline';

export default function getPipeline<S extends LFState = LFState, A extends LFAction = LFAction>(options?: LFPipelineSettings): LFPipeline<S, A> {
    return getPipelineByName(options?.name || 'default');
}