import { LFPipelineMode } from '../types/pipeline';

/**
 * Pipeline setup
 * 
 * @property {boolean} lazy - Setup pipeline as lazy-initialized. Pipeline will remain configurable until first model accessed.
 * This comes handy when advanced configuration of pipeline is required
 * @property {LFPipelineMode} mode - Ether `Host` or `Guest`. Indicates to pipeline should create own store or expect
 * to be attached to external store.
 */
export class LFPipelineSettings {
    lazy?: boolean;

    mode?: LFPipelineMode;
};
