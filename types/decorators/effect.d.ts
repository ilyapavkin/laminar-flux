import { ModelMethodDispatchAttribute } from '../types/model';
import { LFAction, LFPayload } from '../types/internal';
export declare type ModelEffectEndpoint = (action: LFAction<any>) => Promise<LFAction<any>>;
declare type ModelEffect = ModelMethodDispatchAttribute;
export interface ModelReducerDecorator extends ModelEffect {
    (payload: LFPayload): any;
}
export declare function effect<TKey extends string, TTarget extends {
    [k in TKey]: ModelEffectEndpoint;
}>(target: TTarget, propertyName: TKey, descriptor: PropertyDescriptor): void;
export {};
