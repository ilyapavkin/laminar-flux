import { LFModelReducer, LFAction } from '../types/internal';
import LFPipelineContext from './LFPipelineContext';

/**
 * @class LFPipeline
 * @classdesc Aggregator of all components. Models should attach to pipeline
 * Instance of class also provides middleware to attach into redux.
 * @typicalname Pipeline
 */
class LFPipeline<A extends LFAction = LFAction> extends LFPipelineContext<A> {
    attach(actionType: string, model: LFModelReducer, namespace: string): void {
        this.router.add(actionType, model, namespace);
    }

    remove(model: LFModelReducer, actionType?: string, namespace?: string): void {
        this.router.remove(model, actionType, namespace);
    }
}

export default LFPipeline;