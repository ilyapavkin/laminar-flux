/* eslint-disable no-console */
export function trace(...args: unknown[]): void {
    if (typeof console !== 'undefined' && typeof console.log !== 'undefined' && process.env.LOG_LEVEL === 'trace') {
        console.log(...args);
    }
}