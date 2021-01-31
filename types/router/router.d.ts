import { RouterHandler } from '../types/router';
import { LFState, LFAction } from '../types/internal';
declare const LFRouter: <S extends LFState = LFState, A extends LFAction<import("../types/common").Anything> = LFAction<import("../types/common").Anything>>() => RouterHandler<S, A>;
export default LFRouter;
export type { RouterHandler };
