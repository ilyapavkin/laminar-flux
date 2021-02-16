/**
 * @module 
 * 
 */

import { Dispatch } from 'redux';
import {
    ModelDispathableMethod,
    ModelMethodDispatchAttribute,
    ModelMethodActionAttribute
} from '../types/model';
import {
    LFAction,
    LFModelReducer,
    LFPayload,
    LFState,
} from '../types/internal';
import { ConstructorArgs, PlainObject, AnyFunction, Constructor, AnyPrimitive } from '../types/common';
import LFPipeline from '../pipeline/LFPipeline';

import { LFModelBase } from './LFModelBase';
import { ModelReducerEndpoint, GenericModelReducerEndpoint, ModelReducerDecorator } from '../decorators/reducer';
import { ModelEffectEndpoint } from '../decorators/effect';


function isModelDispathableMethod(f: AnyFunction): f is ModelDispathableMethod {
    return (f as ModelDispathableMethod).action !== undefined;
}

type TransformMethods<T extends PlainObject, TCallable, TDecorator> = {
    [P in keyof T]: T[P] extends TCallable ? TDecorator : T[P]
}

type Dispatchable = ModelMethodDispatchAttribute & ModelMethodActionAttribute;


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LaminatorConstructor = Constructor<any>;

/* GenericModelReducerEndpoint<
    TState,
    TData,
    TFunc extends (state: TState, action: LFAction<TData>) => TState
    > = TFunc;*/
type ModelReducer<TState, TData> = (state: TState, action: LFAction<TData>) => TState;

type TransformModel<T extends LaminatorConstructor, TState extends LFState = LFState, TData extends AnyPrimitive = AnyPrimitive, TKey extends keyof T = keyof T> = {
    [K in keyof T]: T[K]
} & {
    // FIXME: this grabs more methods that it should
    new(...args: ConstructorArgs<T>): TransformMethods<InstanceType<T>, (state: any, action: any) => any, ModelReducerDecorator>
    // & TransformMethods<InstanceType<T>, ModelEffectEndpoint, (payload: LFPayload) => void> // FIXME: promise? call handler?
    // & TransformMethods<InstanceType<T>, ModelSagaEndpoint, (payload: LFPayload) => LFCallHandle> // FIXME: implement saga
    // FIXME: figure out how to implement plugin system here.
    // Idea - additional decorators should somehow mutate this type
}

export type LaminarFluxModel = TransformModel<LaminatorConstructor>;

/**
 * Main model class.
 */
export abstract class FluxModel extends LFModelBase {
    protected dispatch: Dispatch<LFAction> = (action) => {

        // FIXME: this should rely on pipeline without checks
        if (this.pl?.dispatch !== undefined) {
            return this.pl.dispatch(action);
        }
        // FIXME: add metadata here:
        throw new Error(`Model ${this} was not attached to any pipeline before method ${action.type} was called`);
    }

    protected set pipeline(pipeline: LFPipeline | null) {
        if (pipeline !== null) {
            this.pl = pipeline;
        }
        this.attachables.forEach(a => {
            if (this.pl) {
                const type = this.ns ? `@@LF:${this.ns}/${a.action.type}` : a.action.type;
                // eslint-disable-next-line no-param-reassign
                a.action.namespace = this.ns;
                // check if pipeline changed
                if (pipeline !== this.pl) {
                    // detach from current pipeline;
                    this.pl.remove(a as never as LFModelReducer, this.ns, type);
                }
                this.pl.attach(a as never as LFModelReducer, this.ns, type);
            }
        });
        this.pl = pipeline === null ? undefined : pipeline;
    }

    protected set namespace(namespace: string | undefined) {
        this.ns = namespace;
    }

    private pl?: LFPipeline;

    private ns?: string;

    private attachables: Set<Dispatchable> = new Set();

    constructor() {
        super();
        const modelType = this.constructor as LaminatorConstructor;
        const staticContents = modelType as never;
        const instanceContents = this as never;
        const derivedPrototype = Reflect.getPrototypeOf(this);

        const assignDispatchOfThis = (props: never[]): void => {
            props.filter(p => typeof p === 'function' && isModelDispathableMethod(p)).forEach(p => {
                const prop = p as Dispatchable;
                prop.dispatch = (action) => this.dispatch(action);
                this.attachables.add(prop);
            });
        }

        assignDispatchOfThis(Object.getOwnPropertyNames(derivedPrototype).map(name => instanceContents[name]));
        assignDispatchOfThis(Object.getOwnPropertyNames(modelType).map(name => staticContents[name]));
    }
}

/**
 * @template M
 * @param {M} definition
 * @return {*} 
 */
const Laminate = <M extends LaminatorConstructor>(definition: M): TransformModel<typeof definition> => {
    return (definition as unknown) as TransformModel<typeof definition>;
};

export default Laminate;