import { checkReducerValid } from 'src/utils/validation';
import { warning } from 'src/utils/warning';
import { PlainObject, isPlainObject } from '../types/common';
import { RouterHandler } from '../types/router';
import { ModelEndpoint, ModelSyncEndpoint } from '../types/model';
import { LFStateEntry, LFState, LFAction, LFModelReducer, LFReducer } from '../types/internal';

type LFModelReducerMapping<S extends LFState = LFState, A extends LFAction = LFAction> = {
    endpoint: ModelEndpoint<S, A>,
    namespace: string
}

type LFRoute<S extends LFState = LFState, A extends LFAction = LFAction> = {
    [key: string]: LFRoute<S, A> | LFModelReducerMapping<S, A>[],
};

type LFRouteLookupCursor<S extends LFState = LFState, A extends LFAction = LFAction> = {
    path?: string[],
    target: LFRoute<S, A>
}

type LFRouteLookup<S extends LFState = LFState, A extends LFAction = LFAction> = {
    path: string[],
    target: LFRoute<S, A>
}

type LFRouteApplicator<S extends LFState = LFState, A extends LFAction = LFAction> = (branch: LFRouteLookup<S, A>, applicator: (routeLookup: LFRouteLookup<S, A>) => void) => void;

type LFRouteTable<S extends LFState = LFState, A extends LFAction = LFAction> = Record<string, LFModelReducerMapping<S, A>[]>;

const LFRouter = <S extends LFState = LFState, A extends LFAction = LFAction>(): RouterHandler<S, A> => {
    // const reducers: Record<string, LFModelReducer> = {};
    // const routeMap: Record<string, string[]> = {};
    let routeTable: LFRouteTable<S, A> = {};
    const routingRoot: LFRoute<S, A> = {};
    let broadcastReducer: LFReducer<S, A> | undefined;
    let basicReducer = false;

    // const broadcast: string[] = [];

    /**
     * Looks up route in map for specific path
     *
     * @param {string[]} path
     * @param {LFRoute} route
     * @return {*}  {LFRoute}
     */
    const lookupIterator = (path: string[], route: LFRoute<S, A>, parent?: LFRoute<S, A>): LFRouteLookupCursor<S, A> => {
        // end of path
        if (path.length === 0) {
            return {
                target: route,
                path: []
            };
        }

        // end of branch
        if (Array.isArray(route)) {
            if (parent === undefined || Array.isArray(parent)) {
                throw new Error(`Incorrect parent param passed: ${parent ? 'Array. (lookup past branch end?)' : 'undefined. (Array at root?)'}`);
            }
            return {
                target: parent,
                path: undefined
            };
        }

        // look for next route
        let target = route[path[0]] as LFRoute<S, A>;
        if (target === undefined) {
            // eslint-disable-next-line no-param-reassign
            route[path[0]] = (path.length === 1 ? [] : {}) as LFRoute<S, A>;
            target = route[path[0]] as LFRoute<S, A>;
        }

        // move along branch
        const next = lookupIterator(path.slice(1), target, route);
        next.path = next.path ? [path[0], ...next.path] : [];
        return next;
    };

    const lookup = (path: string[], route: LFRoute<S, A>): LFRouteLookup<S, A> => {
        return lookupIterator(path, route) as LFRouteLookup<S, A>;
    };

    const applicate: LFRouteApplicator<S, A> = (branch, applicator) => {
        if (Array.isArray(branch.target)) {
            applicator(branch);
            return;
        }

        const looper = (cursor: LFRouteLookup<S, A>): void => {
            Object.keys(cursor.target).forEach(b => {
                const next = {
                    path: [...cursor.path, b],
                    target: cursor.target[b] as LFRoute<S, A>
                };
                if (Array.isArray(cursor.target[b])) {
                    applicator(next);
                } else {
                    looper(next);
                }
            })
        }
        looper(branch);
    }

    const appendEndpoint = (path: string[], routeLookup: LFRouteLookup<S, A>, endpointMapping: LFModelReducerMapping<S, A>): LFRouteLookup<S, A> => {
        const { target } = routeLookup;
        const validateAndAdd = (arr: LFModelReducerMapping<S, A>[], el: LFModelReducerMapping<S, A>): LFModelReducerMapping<S, A>[] => {
            if (arr.filter(ep => ep.endpoint === el.endpoint).length === 0) {
                arr.push(el);
            }
            return arr;
        }
        // check branch status
        if (Array.isArray(target)) {
            // branch is exact
            validateAndAdd(target, endpointMapping);
        } else if (path.length !== routeLookup.path.length) {
            // branch is shorter
            let cursor = target;
            // extension of branch (part to recreate)
            const extension = path.slice(routeLookup.path.length, -1);
            // horrific...
            // end of branch, which is also beginning of extension, contains array of endpoints. Copy that and add new endpoint
            const endpoints = validateAndAdd((target[extension[0]] as LFModelReducerMapping<S, A>[]), endpointMapping);
            extension.forEach(p => {
                cursor[p] = {};
                cursor = cursor[p] as LFRoute<S, A>;
            });
            // finally append updated array
            cursor[path[path.length - 1]] = endpoints;
        } else {
            // branch is longer
            // have to cast "shadow type" through unknown, but applicator will only be called for arrays
            applicate(routeLookup, (endpointLookup) => validateAndAdd((endpointLookup.target as unknown as LFModelReducerMapping<S, A>[]), endpointMapping));
        }

        return routeLookup;
    };

    const rebuildTable = (update: LFRouteLookup<S, A>): LFRouteTable<S, A> => {
        const alter: LFRouteTable<S, A> = {};
        applicate(update, (endpointLookup) => {
            alter[`@@LF:${endpointLookup.path.join('/')}`] = endpointLookup.target as unknown as LFModelReducerMapping<S, A>[];
        });
        return alter;
    };


    const func: RouterHandler<S, A> = (state?, action?): S => {
        const currentState = state;
        if (action === undefined) {
            throw new Error('Undefined action');
        }

        if (basicReducer && typeof broadcastReducer !== 'undefined') {
            return broadcastReducer(currentState, action);
        }

        const update = broadcastReducer !== undefined ? broadcastReducer(currentState, action) : {};

        if (routeTable[action.type] !== undefined) {
            const endpoints = routeTable[action.type];
            Object.assign(update, {
                '@@LF_CTX': endpoints.map(endpoint => {
                    const reducer = endpoint.endpoint;
                    if (reducer.constructor.name !== 'AsyncFunction') {
                        // FIXME: cast as LFStateEntry in following line is actually a mistake.
                        // TODO: figure out proper way to work with combinedReducers from `redux`.
                        const res = (reducer as ModelSyncEndpoint)(((currentState as PlainObject)['@@LF_CTX'] as LFStateEntry)[endpoint.namespace] as LFState, action);
                        return { [endpoint.namespace]: res };
                    }
                    return currentState;
                }).reduce((acc, val) => Object.assign(acc, val), {})
            }); // FIXME: is it even valid?
        }

        return update as S;
    }

    func.add = (reducer: LFModelReducer<S, A>, namespace?: string, actionType?: string): void => {
        // if actionType is undefined - reducer expected to response to AnyAction.
        if (actionType === undefined) {
            // if namespace is undefined - reducer considered to be root combined reducer.
            if (namespace === undefined) {
                // if one is already set - throw error.
                if (broadcastReducer !== undefined) {
                    throw new Error('Broadcast reducer already set.'); // FIXME: should not be a problem
                } else {
                    const initType = checkReducerValid<S, A>(reducer);
                    basicReducer = !isPlainObject(initType);
                    if (basicReducer) {
                        warning('Mounted broadcast reducer returns non plain object after init. This reducer can not be combined with other reducers. All prior and subsequent reducers will be ignored.');
                    }
                    broadcastReducer = reducer;
                }
            } else {
                // FIXME: ub
            }
            return;
        }

        if (namespace === undefined) {
            throw new Error('Namespace should be set!');
        }

        // check if action type is inner type of LaminarFlux
        if (actionType.startsWith('@@LF:')) {
            // Just for clarity, will return at rebuild.
            const pathArray = actionType.slice(5).split('/');
            // Look into branch, find how late alteration required, extend branch if possible
            const routeLookup = lookup(pathArray, routingRoot);
            // Form update tree
            const update = appendEndpoint(pathArray, routeLookup, {
                endpoint: reducer,
                namespace
            });
            // Convert back to table alter
            const alter = rebuildTable(update);
            // Apply to table
            Object.keys(alter).forEach(type => { routeTable[type] = alter[type]; });
        }
    }

    const removeAll = (reducer: LFModelReducer<S, A>): void => {
        const allPathsToLookup = Object.keys(routeTable).filter(actionType => actionType.startsWith('@@LF:')).map(actionType => actionType.slice(5).split('/'));
        allPathsToLookup.forEach(path => {
            const endpoint = lookup(path, routingRoot);
            const mappings = endpoint.target as unknown as LFModelReducerMapping[];
            const idx = mappings.map(mapping => mapping.endpoint !== reducer).indexOf(true);
            if (idx !== -1) {
                mappings.splice(idx, 1);
            }
        });

        // FIXME: implement update mechanic like in `add`
        const alter = rebuildTable({
            path: [] as string[],
            target: routingRoot
        });

        // FIXME: slow?
        const newTable: LFRouteTable<S, A> = {};
        Object.keys(alter).filter(type => alter[type].length).forEach(type => { newTable[type] = alter[type] });
        routeTable = newTable;
    }

    func.remove = (reducer: LFModelReducer<S, A>/* , actionType?: string, namespace?: string */): void => {
        // FIXME: no implementation for specific action type and namespace
        removeAll(reducer);
    }

    return func;
}

export default LFRouter;
export type { RouterHandler };