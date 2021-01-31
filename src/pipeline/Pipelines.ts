import { LFAction, LFState } from '../types/internal';
import LFPipeline from './LFPipeline';
import { trace } from '../utils/trace';

type LFPipelinesMap = Record<string, LFPipeline>;

const lfPipelines: LFPipelinesMap = {};

function getPipelineByName<S extends LFState, A extends LFAction>(name: string): LFPipeline<S, A> {
    trace('requesting pipeline', name);
    let pipeline = lfPipelines[name] as unknown as LFPipeline<S, A>;
    if (pipeline === undefined) {
        trace('pipeline was not found, creating');
        trace('getPipelineByName', name, pipeline);
        pipeline = new LFPipeline<S, A>();
        lfPipelines[name] = pipeline as unknown as LFPipeline;
        trace('pipelines:', name, pipeline);
    }
    return pipeline;
}

function dropPipelineByName(name: string): void {
    if (lfPipelines[name] !== undefined) {
        trace('removing pipeline', name);
        delete lfPipelines[name];
        trace('pipelines:', lfPipelines);
    }
}

function setDefault<S extends LFState = LFState, A extends LFAction = LFAction>(pipeline: LFPipeline<S, A>): void {
    trace('updated default pipeline');
    lfPipelines.default = pipeline as unknown as LFPipeline;
}

export { getPipelineByName, dropPipelineByName, setDefault }