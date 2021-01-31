/* eslint-disable no-console */
export function warning(message: string): void {
    if (typeof console !== 'undefined' && typeof console.error !== 'undefined' && process.env.NODE_ENV !== 'test') {
        console.error(message);
    }

    try {
        throw new Error(message);
    } catch (e) {
        // silence, error!
    }
}