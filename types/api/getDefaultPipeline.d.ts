import { LFAction, LFState } from '../types/internal';
import LFPipeline from '../pipeline';
export default function getDefaultPipeline<S extends LFState = LFState, A extends LFAction = LFAction>(): LFPipeline<S, A>;
