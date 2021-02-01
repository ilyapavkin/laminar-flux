import { RouterHandler } from '../types/router';
import { LFAction } from '../types/internal';
declare const LFRouter: <S extends unknown = any, A extends LFAction<import("../types/common").Anything> = LFAction<import("../types/common").Anything>>() => RouterHandler<S, A>;
export default LFRouter;
export type { RouterHandler };
