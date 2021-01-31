import { LFAction, LFState } from '../types/internal';
import LFPipeline from '../pipeline';
export declare function getDefaultPipeline<S extends LFState = LFState, A extends LFAction = LFAction>(): LFPipeline<S, A>;
