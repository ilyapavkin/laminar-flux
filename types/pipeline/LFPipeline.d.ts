import { LFModelReducer, LFAction, LFState } from '../types/internal';
import LFPipelineContext from './LFPipelineContext';
/**
 * @class LFPipeline
 * @classdesc Aggregator of all components. Models should attach to pipeline
 * Instance of class also provides middleware to attach into redux.
 * @typicalname Pipeline
 */
declare class LFPipeline<S extends LFState = LFState, A extends LFAction = LFAction> extends LFPipelineContext<S, A> {
    attach(model: LFModelReducer<S, A>, namespace?: string, actionType?: string): void;
    remove(model: LFModelReducer<S, A>, namespace?: string, actionType?: string): void;
}
export default LFPipeline;
