import { FluxModel } from 'src/model';
import { trace } from 'src/utils/trace';
import { getDefaultPipeline } from '../api';
import LFPipeline from '../pipeline';

// FIXME: get rid of any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function attach(toPipeline?: LFPipeline): (f: unknown) => any {
    return (origConstructor: unknown): FluxModel => {
        /* const preserved = origConstructor;
        if (!preserved.prototype.injections) {
            preserved.prototype.injections = [];
        }*/

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
                obj.pipeline = pipeline;
                obj.detach = (): void => {
                    obj.pipeline = null;
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