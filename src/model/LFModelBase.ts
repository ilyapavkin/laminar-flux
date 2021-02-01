import { createReducer } from 'typesafe-actions';
import { LFModelReducer } from '../types/internal';

export abstract class LFModelBase {
    #reducer = createReducer({});

    private get reducer(): LFModelReducer {
        return this.#reducer;
    }
};