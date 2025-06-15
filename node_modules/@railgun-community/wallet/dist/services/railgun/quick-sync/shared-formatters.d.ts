import { PreImage, TokenData, TokenType } from '@railgun-community/engine';
import { TokenType as GraphTokenTypeV2, Token as GraphTokenV2, CommitmentPreimage as GraphCommitmentPreimageV2 } from './V2/graphql';
import { TokenType as GraphTokenTypeV3, Token as GraphTokenV3, CommitmentPreimage as GraphCommitmentPreimageV3 } from './V3/graphql';
export declare const graphTokenTypeToEngineTokenType: (graphTokenType: GraphTokenTypeV2 | GraphTokenTypeV3) => TokenType;
export declare const formatSerializedToken: (graphToken: GraphTokenV2 | GraphTokenV3) => TokenData;
export declare const formatPreImage: (graphPreImage: GraphCommitmentPreimageV2 | GraphCommitmentPreimageV3) => PreImage;
export declare const formatTo16Bytes: (value: string, prefix: boolean) => string;
export declare const formatTo32Bytes: (value: string, prefix: boolean) => string;
export declare const bigIntStringToHex: (bigintString: string) => string;
