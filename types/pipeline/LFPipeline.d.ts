import { LFModelReducer, LFAction } from '../types/internal';
import LFPipelineContext from './LFPipelineContext';
/**
 * @class LFPipeline
 * @classdesc Aggregator of all components. Models should attach to pipeline
 * Instance of class also provides middleware to attach into redux.
 * @typicalname Pipeline
 */
declare class LFPipeline<A extends LFAction = LFAction> extends LFPipelineContext<A> {
    attach(actionType: string, model: LFModelReducer, namespace: string): void;
    remove(model: LFModelReducer, actionType?: string, namespace?: string): void;
}
export default LFPipeline;
