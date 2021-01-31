import { Anything } from 'src/types/common';
import { StoreEnhancer } from 'redux';

type StoreContentsOptions = {
    global?: Anything;
};

type StoreContents = {
    '@@LF_GLOBAL_CTX'?: Anything
};

export const createStoreContent = (options?: StoreContentsOptions): StoreEnhancer => {
    const ctx: StoreContents = {};
    if (options) {
        if (options.global) {
            Object.assign(ctx, { '@@LF_GLOBAL_CTX': options.global });
        }
    }
    return ctx as StoreEnhancer;
}