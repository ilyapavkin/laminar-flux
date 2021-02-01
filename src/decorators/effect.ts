import { ModelMethodDispatchAttribute } from '../types/model';
import { LFAction, LFPayload } from '../types/internal';

export type ModelEffectEndpoint = (action: LFAction<any>) => Promise<LFAction<any>>;

type ModelEffect = ModelMethodDispatchAttribute;

export interface ModelReducerDecorator extends ModelEffect {
    (payload: LFPayload): any;             // dispatch message with payload
}

export function effect<
    TKey extends string,
    TTarget extends { [k in TKey]: ModelEffectEndpoint }
>(target: TTarget, propertyName: TKey, descriptor: PropertyDescriptor): void {
    const namespace = `${target.constructor.name}`;
    const type = `@@LF:${namespace}/${propertyName}`;
    const wrapped = target[propertyName];
    const executor = (action: LFAction<any>, ...args: []): Promise<LFAction<any>> => {
        return (wrapped as ModelEffectEndpoint)(action);
        // return new Promise<LFAction>()
        /* const self = executor as ModelReducerDecorator;
        if (args.length === 0) {
            if (!self.dispatch) {
                throw new Error(`Dispatcher not available for method [${propertyName}]`);
            }
            trace('dispatching!');
            trace(self.dispatch(self.action(payloadContents)));
            return undefined;
        }

        const action = (args as unknown[])[0] as LFAction;
        if (action.type && action.type === type) {
            return wrapped(payloadContents as LFState, action);
        }

        return payloadContents as LFState;*/
    };

    Object.defineProperties(executor, {
        'name': { value: propertyName },
        /* 'action': {
            value: Object.assign((payload: LFPayload) => {
                return { type, payload };
            }, { type, namespace })
        }*/
    });

    // Decorator specific
    // eslint-disable-next-line no-param-reassign
    descriptor.value = executor;
}