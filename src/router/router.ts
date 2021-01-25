import { RouterHandler } from '../types/router';
import { ModelEndpoint, ModelSyncEndpoint } from '../types/model';
import { LFState, LFAction, LFModelReducer } from '../types/internal';

type LFModelReducerMapping = {
    endpoint: ModelEndpoint,
    namespace: string
}

type LFRoute = {
    [key: string]: LFRoute | LFModelReducerMapping[],
};

type LFRouteLookupCursor = {
    path?: string[],
    target: LFRoute
}

type LFRouteLookup = {
    path: string[],
    target: LFRoute
}

type LFRouteApplicator = (branch: LFRouteLookup, applicator: (routeLookup: LFRouteLookup) => void) => void;

type LFRouteTable = Record<string, LFModelReducerMapping[]>;

const LFRouter = (): RouterHandler<LFState, LFAction> => {
    const reducers: Record<string, LFModelReducer> = {};
    const routeMap: Record<string, string[]> = {};
    let routeTable: LFRouteTable = {};
    const routingRoot: LFRoute = {};

    const broadcast: string[] = [];

    /**
     * Looks up route in map for specific path
     *
     * @param {string[]} path
     * @param {LFRoute} route
     * @return {*}  {LFRoute}
     */
    const lookupIterator = (path: string[], route: LFRoute, parent?: LFRoute): LFRouteLookupCursor => {
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
        let target = route[path[0]] as LFRoute;
        if (target === undefined) {
            // eslint-disable-next-line no-param-reassign
            route[path[0]] = (path.length === 1 ? [] : {}) as LFRoute;
            target = route[path[0]] as LFRoute;
        }

        // move along branch
        const next = lookupIterator(path.slice(1), target, route);
        next.path = next.path ? [path[0], ...next.path] : [];
        return next;
    };

    const lookup = (path: string[], route: LFRoute): LFRouteLookup => {
        return lookupIterator(path, route) as LFRouteLookup;
    };

    const applicate: LFRouteApplicator = (branch, applicator) => {
        if (Array.isArray(branch.target)) {
            applicator(branch);
            return;
        }

        const looper = (cursor: LFRouteLookup): void => {
            Object.keys(cursor.target).forEach(b => {
                const next = {
                    path: [...cursor.path, b],
                    target: cursor.target[b] as LFRoute
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

    const appendEndpoint = (path: string[], routeLookup: LFRouteLookup, endpointMapping: LFModelReducerMapping): LFRouteLookup => {
        const { target } = routeLookup;
        const validateAndAdd = (arr: LFModelReducerMapping[], el: LFModelReducerMapping): LFModelReducerMapping[] => {
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
            const endpoints = validateAndAdd((target[extension[0]] as LFModelReducerMapping[]), endpointMapping);
            extension.forEach(p => {
                cursor[p] = {};
                cursor = cursor[p] as LFRoute;
            });
            // finally append updated array
            cursor[path[path.length - 1]] = endpoints;
        } else {
            // branch is longer
            // have to cast "shadow type" through unknown, but applicator will only be called for arrays
            applicate(routeLookup, (endpointLookup) => validateAndAdd((endpointLookup.target as unknown as LFModelReducerMapping[]), endpointMapping));
        }

        return routeLookup;
    };

    const rebuildTable = (update: LFRouteLookup): LFRouteTable => {
        const alter: LFRouteTable = {};
        applicate(update, (endpointLookup) => {
            alter[`@@LF:${endpointLookup.path.join('/')}`] = endpointLookup.target as unknown as LFModelReducerMapping[];
        });
        return alter;
    };


    const func: RouterHandler<LFState, LFAction> = (state, action): LFState => {
        if (routeTable[action.type] !== undefined) {
            const endpoints = routeTable[action.type];
            const update = endpoints.map(endpoint => {
                const reducer = endpoint.endpoint;
                if (reducer.constructor.name !== 'AsyncFunction') {
                    const res = (reducer as ModelSyncEndpoint)(state[endpoint.namespace] as LFState, action);
                    return { [endpoint.namespace]: res };
                }
                return state;
            }).reduce((acc, val) => Object.assign(acc, val), {}); // FIXME: is it even valid?
            return Object.assign(state, update);
        }

        let updates = broadcast.map((namespace) => ({
            namespace,
            newState: reducers[namespace](state[namespace] as LFState, action),
        }));

        if (routeMap[action.type] !== undefined) {
            updates = [
                ...routeMap[action.type].map((namespace) => ({
                    namespace,
                    newState: reducers[namespace](state[namespace] as LFState, action),
                })),
                ...updates
            ];
        }

        const updatedState = updates.reduce((acc: LFState, el) => {
            acc[el.namespace] = el.newState;
            return acc;
        }, {});

        return { ...state, ...updatedState } as LFState;
    }

    func.add = (path: string, reducer: LFModelReducer, namespace: string): void => {
        // check if action type is inner type of LaminarFlux
        if (path.startsWith('@@LF:')) {
            // Just for clarity, will return at rebuild.
            const pathArray = path.slice(5).split('/');
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

    const removeAll = (reducer: LFModelReducer): void => {
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
        const newTable: LFRouteTable = {};
        Object.keys(alter).filter(type => alter[type].length).forEach(type => { newTable[type] = alter[type] });
        routeTable = newTable;
    }

    func.remove = (reducer: LFModelReducer, actionType?: string, namespace?: string): void => {
        // FIXME: no implementation for specific action type and namespace
        removeAll(reducer);
    }

    return func;
}

export default LFRouter;
export type { RouterHandler };