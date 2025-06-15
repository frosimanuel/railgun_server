import { Artifact } from '@railgun-community/shared-models';
import { ArtifactStore } from './artifact-store';
export declare class ArtifactDownloader {
    private artifactStore;
    private useNativeArtifacts;
    constructor(artifactStore: ArtifactStore, useNativeArtifacts: boolean);
    downloadArtifacts: (artifactVariantString: string) => Promise<void>;
    private downloadArtifact;
    private static getArtifactData;
    private static artifactResponseType;
    private getDownloadedArtifact;
    getDownloadedArtifacts: (artifactVariantString: string) => Promise<Artifact>;
}
