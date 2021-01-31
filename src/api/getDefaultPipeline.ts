import { LFAction, LFState } from '../types/internal';
import LFPipeline/* , { LFPipelineSettings }*/ from '../pipeline';
import getPipeline from './getPipeline';

export default function getDefaultPipeline<S extends LFState = LFState, A extends LFAction = LFAction>(/* options?: LFPipelineSettings*/): LFPipeline<S, A> {
    return getPipeline();
}