/**
 * @module
 *
 */
import { Dispatch } from 'redux';
import { LFAction, LFPayload } from '../types/internal';
import { ConstructorArgs, AnyObject, Constructor } from '../types/common';
import LFPipeline from '../pipeline/LFPipeline';
import { LFModelBase } from './LFModelBase';
import { ModelReducerEndpoint, ModelReducerDecorator } from '../decorators/reducer';
import { ModelEffectEndpoint } from '../decorators/effect';
declare type TransformMethods<T extends AnyObject, TCallable, TDecorator> = {
    [P in keyof T]: T[P] extends TCallable ? TDecorator : T[P];
};
declare type LaminatorConstructor = Constructor<any>;
export declare type LaminarFluxModel = TransformModel<LaminatorConstructor>;
declare type TransformModel<T extends LaminatorConstructor> = {
    [K in keyof T]: T[K];
} & {
    new (...args: ConstructorArgs<T>): TransformMethods<InstanceType<T>, ModelReducerEndpoint, ModelReducerDecorator> & TransformMethods<InstanceType<T>, ModelEffectEndpoint, (payload: LFPayload) => unknown>;
};
/**
 * Main model class.
 */
export declare abstract class FluxModel extends LFModelBase {
    protected dispatch: Dispatch<LFAction>;
    protected set pipeline(pipeline: LFPipeline | null);
    private pl?;
    private attachables;
    constructor();
}
/**
 * @template M
 * @param {M} definition
 * @return {*}
 */
declare const Laminate: <M extends Constructor<any>>(definition: M) => TransformModel<M>;
export default Laminate;
