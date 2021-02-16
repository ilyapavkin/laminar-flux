import { AnyPrimitive } from '../types/common';
import { LFState, LFAction, LFPayload } from '../types/internal';
import { ModelMethodActionAttribute, ModelMethodDispatchAttribute } from '../types/model';

export type GenericModelReducerEndpoint<
    // TState extends LFState = LFState,
    // TData extends AnyPrimitive = AnyPrimitive,
    TState,
    TData,
    TFunc extends (state: TState, action: LFAction<TData>) => TState
    > = TFunc;

type ModelReducer = ModelMethodDispatchAttribute & ModelMethodActionAttribute;

// FIXME: clean this up
// export type ModelReducerEndpoint<TState extends LFState = LFState, TData = LFPayload> = (state: TState, action: LFAction<TData>) => TState;
export type ModelReducerEndpoint<TState extends LFState = LFState, TData = LFPayload> = (state: TState, action: LFAction<TData>) => TState;
export interface ModelReducerDecorator<TState extends LFState = LFState, TData = LFPayload> extends ModelReducer {
    (payload: TData): TState;             // dispatch message with payload
}

export function reducer<TState extends LFState = LFState, TData extends AnyPrimitive = AnyPrimitive>() {
    return <
        TKey extends string,
        TTarget extends {
            [K in TKey]: GenericModelReducerEndpoint<TState, TData, TTarget[K]>;
        }
    >(target: TTarget, propertyName: TKey, descriptor: PropertyDescriptor): void => {
        const model = target.constructor as any;
        let type: string;
        const wrapped = target[propertyName];
        const executor = (payloadContents: TData, ...args: []): TState | undefined => {
            const self = executor as ModelReducerDecorator<TState, TData>;
            // FIXME: vague detection of external call
            if (args.length === 0) {
                if (!self.dispatch) {
                    throw new Error(`Dispatcher not available for method [${propertyName}]`);
                }
                self.dispatch(self.action(payloadContents))
                // FIXME: undefined should be replaced with something related to external call
                return undefined;
            }

            if (self.action.namespace === undefined || typeof self.action.namespace !== 'string' || !self.action.namespace) {
                throw new Error('namespace is undefined');
            }

            // due to @attach called after @reducer namespace is undefined in upper scope, but should be present in runtime
            if (type === undefined) {
                type = `@@LF:${self.action.namespace}/${propertyName}`;
            }

            const action = (args as unknown[])[0] as LFAction;
            if (action.type && action.type === type) {
                return wrapped(payloadContents as LFState, action);
            }

            return payloadContents as LFState;
        };

        Object.defineProperties(executor, {
            name: { value: propertyName },
            action: {
                value: Object.assign((payload: LFPayload) => {
                    const ns = (executor as ModelReducerDecorator<TState, TData>).action.namespace;
                    return { type: type || ns !== undefined ? `@@LF:${ns}/${propertyName}` : propertyName, payload };
                }, { type: propertyName })
            }
        });

        Object.assign(descriptor, { value: executor });
    }
}
