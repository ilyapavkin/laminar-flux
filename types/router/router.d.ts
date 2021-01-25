import { RouterHandler } from '../types/router';
import { LFState, LFAction } from '../types/internal';
declare const LFRouter: () => RouterHandler<LFState, LFAction>;
export default LFRouter;
export type { RouterHandler };
