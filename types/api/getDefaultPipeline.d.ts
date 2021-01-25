import { LFAction } from '../types/internal';
import LFPipeline from '../pipeline';
export declare function getDefaultPipeline<A extends LFAction = LFAction>(): LFPipeline<A>;
