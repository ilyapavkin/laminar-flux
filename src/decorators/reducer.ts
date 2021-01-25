import { LFState, LFAction, LFPayload } from '../types/internal';
import { DispatchAttribute } from '../types/model';

export type ModelReducerEndpoint = (state: LFState, action: LFAction) => LFState;

export interface ModelReducerDecorator extends DispatchAttribute {
    (payload: LFPayload): LFState;             // dispatch message with payload
}

export function reducer<
    TKey extends string,
    TTarget extends { [K in TKey]: ModelReducerEndpoint }
>(target: TTarget, propertyName: TKey, descriptor: PropertyDescriptor): void {
    const namespace = `${target.constructor.name}`;
    const type = `@@LF:${namespace}/${propertyName}`;
    const wrapped = target[propertyName];
    const executor = (payloadContents: LFPayload, ...args: []): LFState | undefined => {
        const self = executor as ModelReducerDecorator;
        if (args.length === 0) {
            if (!self.dispatch) {
                throw new Error(`Dispatcher not available for method [${propertyName}]`);
            }
            self.dispatch(self.action(payloadContents));
            return undefined;
        }

        const action = (args as unknown[])[0] as LFAction;
        if (action.type && action.type === type) {
            return wrapped(payloadContents as LFState, action);
        }

        return payloadContents as LFState;
    };

    Object.defineProperties(executor, {
        'name': { value: propertyName },
        'action': {
            value: Object.assign((payload: LFPayload) => {
                return { type, payload };
            }, { type, namespace })
        }
    });

    // Decorator specific
    // eslint-disable-next-line no-param-reassign
    descriptor.value = executor;
}