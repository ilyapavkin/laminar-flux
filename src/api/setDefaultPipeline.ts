import { LFAction, LFState } from '../types/internal';
import LFPipeline, { setDefault } from '../pipeline';

export default function setDefaultPipeline<S extends LFState = LFState, A extends LFAction = LFAction>(pipeline: LFPipeline<S, A>): void {
    setDefault(pipeline);
}