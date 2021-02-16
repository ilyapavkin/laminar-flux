/**
 * @module
 *
 */
import { Dispatch } from 'redux';
import { LFAction, LFState } from '../types/internal';
import { ConstructorArgs, PlainObject, Constructor, AnyPrimitive } from '../types/common';
import LFPipeline from '../pipeline/LFPipeline';
import { LFModelBase } from './LFModelBase';
import { ModelReducerDecorator } from '../decorators/reducer';
declare type TransformMethods<T extends PlainObject, TCallable, TDecorator> = {
    [P in keyof T]: T[P] extends TCallable ? TDecorator : T[P];
};
declare type LaminatorConstructor = Constructor<any>;
declare type TransformModel<T extends LaminatorConstructor, TState extends LFState = LFState, TData extends AnyPrimitive = AnyPrimitive, TKey extends keyof T = keyof T> = {
    [K in keyof T]: T[K];
} & {
    new (...args: ConstructorArgs<T>): TransformMethods<InstanceType<T>, (state: any, action: any) => any, ModelReducerDecorator>;
};
export declare type LaminarFluxModel = TransformModel<LaminatorConstructor>;
/**
 * Main model class.
 */
export declare abstract class FluxModel extends LFModelBase {
    protected dispatch: Dispatch<LFAction>;
    protected set pipeline(pipeline: LFPipeline | null);
    protected set namespace(namespace: string | undefined);
    private pl?;
    private ns?;
    private attachables;
    constructor();
}
/**
 * @template M
 * @param {M} definition
 * @return {*}
 */
declare const Laminate: <M extends Constructor<any>>(definition: M) => TransformModel<M, any, import("../types/common").TypeMapArray<string | number | symbol, import("../types/common").Primitive>, keyof M>;
export default Laminate;
