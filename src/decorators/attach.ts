import { FluxModel } from '../model';
import { trace } from '../utils/trace';
import { getDefaultPipeline } from '../api';
import LFPipeline from '../pipeline';

// FIXME: get rid of any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function attach(namespace: string, toPipeline?: LFPipeline): (f: unknown) => any {
    return (origConstructor: unknown): FluxModel => {
        const proxyHandler = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            construct(target: any, args: any[], newTarget: any): any {
                const obj = Reflect.construct(target, args, newTarget);
                // FIXME: maybe make this runtime import?
                /* 
                // lazy init, handle attachment in runtime
                    import('../api/getDefaultPipeline')
                        .then(({ getDefaultPipeline }) => {
                            const defaultPipeline = getDefaultPipeline();
                            defaultPipeline.attach(derivedPrototype as FluxModel);
                        })
                        .catch(err => { throw err; });
                */
                // FIXME: configure non-default pipeline
                const pipeline = toPipeline === undefined ? getDefaultPipeline() : toPipeline;
                trace('attaching model to pipeline');
                obj.namespace = namespace;
                obj.pipeline = pipeline;
                obj.detach = (): void => {
                    obj.pipeline = null;
                }
                obj.getNamespace = (): string | undefined => {
                    return obj.ns;
                }
                // pipeline.attach(obj);
                // try {
                // dump(obj);
                // } catch (err) {
                //    throw err;
                // }

                return obj;
            }
        }

        return new Proxy(origConstructor, proxyHandler);
    };
}