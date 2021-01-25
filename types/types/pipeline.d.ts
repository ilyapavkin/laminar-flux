/**
 * Enum for pipeline type
 * @readonly
 * @enum {string}
 * @property {string} Host In `Host` mode pipeline hosts its own store and attach conventional reducers to it (if needed)
 */
export declare enum LFPipelineMode {
    /** In `Host` mode pipeline hosts its own store and attach conventional reducers to it (if needed) */
    Host = "host",
    /** In `Guest` mode pipeline expect to be attached as combined or main reducer of external store */
    Guest = "guest"
}
/**
 * Pipeline settings
 *
 * @property {boolean} lazy - Setup pipeline as lazy-initialized. Pipeline will remain configurable until first model accessed.
 * This comes handy when advanced configuration of pipeline is required
 * @property {LFPipelineMode} mode - Ether `Host` or `Guest`. Indicates to pipeline should create own store or expect
 * to be attached to external store.
 */
export declare type LFPipelineSettings = {
    lazy?: boolean;
    mode?: LFPipelineMode;
};
