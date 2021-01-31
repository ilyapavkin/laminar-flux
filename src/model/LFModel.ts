/**
 * @module 
 * 
 */

import { Dispatch } from 'redux';
import { trace } from 'src/utils/trace';
import {
    ModelDispathableMethod,
    DispatchAttribute
} from '../types/model';
import {
    LFAction,
    LFModelReducer,
    LFPayload,
} from '../types/internal';
import { ConstructorArgs, PlainObject, AnyFunction, Constructor } from '../types/common';
import LFPipeline from '../pipeline/LFPipeline';

import { LFModelBase } from './LFModelBase';
import { ModelReducerEndpoint, ModelReducerDecorator } from '../decorators/reducer';
import { ModelEffectEndpoint } from '../decorators/effect';


function isModelDispathableMethod(f: AnyFunction): f is ModelDispathableMethod {
    return (f as ModelDispathableMethod).action !== undefined;
}

type TransformMethods<T extends PlainObject, TCallable, TDecorator> = {
    [P in keyof T]: T[P] extends TCallable ? TDecorator : T[P]
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LaminatorConstructor = Constructor<any>;
export type LaminarFluxModel = TransformModel<LaminatorConstructor>;

type TransformModel<T extends LaminatorConstructor> = {
    [K in keyof T]: T[K]
} & {
    new(...args: ConstructorArgs<T>): TransformMethods<InstanceType<T>, ModelReducerEndpoint, ModelReducerDecorator>
        & TransformMethods<InstanceType<T>, ModelEffectEndpoint, (payload: LFPayload) => unknown> // FIXME: promise? call handler?
    // & TransformMethods<InstanceType<T>, ModelSagaEndpoint, (payload: LFPayload) => LFCallHandle> // FIXME: implement saga
    // FIXME: figure out how to implement plugin system here.
    // Idea - additional decorators should somehow mutate this type
}

/**
 * Main model class.
 */
export abstract class FluxModel extends LFModelBase {
    protected dispatch: Dispatch<LFAction> = (action) => {
        trace('inside default dispatch');
        // FIXME: this should rely on pipeline without checks
        if (this.pl?.dispatch !== undefined) {
            trace('calling dispatcher');
            return this.pl.dispatch(action);
        }
        // FIXME: add metadata here:
        throw new Error(`Model ${this} was not attached to any pipeline before method ${action.type} was called`);
    }

    protected set pipeline(pipeline: LFPipeline | null) {
        trace('updating pipeline of model');
        if (pipeline !== null) {
            trace('pipeline set');
            this.pl = pipeline;
        }
        this.attachables.forEach(a => {
            if (this.pl) {
                // check if pipeline changed
                if (pipeline !== this.pl) {
                    trace('detaching from old pipeline');
                    // detach from current pipeline;
                    this.pl.remove(a as never as LFModelReducer, a.action.namespace || this.constructor.name, a.action.type);
                }
                trace('attaching to new pipeline', a.action.type);
                this.pl.attach(a as never as LFModelReducer, a.action.namespace || this.constructor.name, a.action.type);
            }
        });
        this.pl = pipeline === null ? undefined : pipeline;
    }

    private pl?: LFPipeline;

    private attachables: Set<DispatchAttribute> = new Set();

    constructor() {
        super();
        const modelType = this.constructor as LaminatorConstructor;
        const staticContents = modelType as never;
        const instanceContents = this as never;
        const derivedPrototype = Reflect.getPrototypeOf(this);

        const assignDispatchOfThis = (props: never[]): void => {
            props.filter(p => typeof p === 'function' && isModelDispathableMethod(p)).forEach(p => {
                const prop = p as DispatchAttribute;
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