/// <reference types="node" />
import { ArtifactName } from '@railgun-community/shared-models';
export declare const validateArtifactDownload: (data: Uint8Array | Buffer | string, artifactName: ArtifactName, artifactVariantString: string) => Promise<boolean>;
