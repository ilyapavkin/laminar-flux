/**
 * @module 
 * 
 */

import { Dispatch } from 'redux';
import {
    ModelDispathableMethod,
    DispatchAttribute
} from '../types/model';
import {
    LFAction,
    LFModelReducer,
    LFPayload,
} from '../types/internal';
import { ConstructorArgs, AnyObject, AnyFunction, Constructor } from '../types/common';
import LFPipeline from '../pipeline/LFPipeline';

import { LFModelBase } from './LFModelBase';
import { ModelReducerEndpoint, ModelReducerDecorator } from '../decorators/reducer';
import { ModelEffectEndpoint } from '../decorators/effect';


function isModelDispathableMethod(f: AnyFunction): f is ModelDispathableMethod {
    return (f as ModelDispathableMethod).action !== undefined;
}

type TransformMethods<T extends AnyObject, TCallable, TDecorator> = {
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
    // TODO: clean up somehow...
    protected dispatch: Dispatch<LFAction> = () => {
        throw new Error('dispatch was not assigned');
    }

    protected set pipeline(pipeline: LFPipeline | null) {
        if (pipeline !== null) {
            this.pl = pipeline;
            if (pipeline.dispatch !== undefined) {
                this.dispatch = pipeline.dispatch;
            }
        }
        this.attachables.forEach(a => {
            if (this.pl) {
                // check if pipeline changed
                if (pipeline !== this.pl) {
                    // detach from current pipeline;
                    this.pl.remove(a as never as LFModelReducer, a.action.type, a.action.namespace || this.constructor.name);
                }
                this.pl.attach(a.action.type, a as never as LFModelReducer, a.action.namespace || this.constructor.name);
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
                prop.dispatch = ((action) => this.dispatch(action)) as Dispatch;
                if (this.pl !== undefined) {
                    // FIXME: figure out attach strategy (@see: ../decorators/attach)
                    this.pl.attach(prop.action.type, p as LFModelReducer, prop.action.namespace || this.constructor.name);
                }
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