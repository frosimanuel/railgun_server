import { MeshInstance } from '@graphql-mesh/runtime';
import { YamlConfig } from '@graphql-mesh/types';
import { Router } from '@whatwg-node/router';
export type MeshHTTPHandler<TServerContext> = Router<TServerContext>;
export declare function createMeshHTTPHandler<TServerContext>({ baseDir, getBuiltMesh, rawServeConfig, playgroundTitle, }: {
    baseDir: string;
    getBuiltMesh: () => Promise<MeshInstance>;
    rawServeConfig?: YamlConfig.Config['serve'];
    playgroundTitle?: string;
}): MeshHTTPHandler<TServerContext>;
