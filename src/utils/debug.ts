/* eslint-disable no-console */
import { inspect } from 'util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debug(...args: Array<any>): void {
    // eslint-disable-next-line no-console
    console.log(args);
}

export function dump(o: unknown, depth = 5): void {
    console.log(inspect(o, {
        showHidden: true,
        depth
    }));
}