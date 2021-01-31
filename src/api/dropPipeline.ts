import { dropPipelineByName } from '../pipeline';

export default function dropPipeline(name: string): void {
    return dropPipelineByName(name);
}