import { encryptJSONDataWithSharedKey, tryDecryptJSONDataWithSharedKey, getPublicViewingKey, EncryptedData, ViewingKeyPair } from '@railgun-community/engine';
import { EncryptDataWithSharedKeyResponse } from '@railgun-community/shared-models';
export declare const verifyBroadcasterSignature: (signature: string | Uint8Array, data: string | Uint8Array, signingKey: Uint8Array) => Promise<boolean>;
export declare const encryptDataWithSharedKey: (data: object, externalPubKey: Uint8Array) => Promise<EncryptDataWithSharedKeyResponse>;
export declare const decryptAESGCM256: (encryptedData: EncryptedData, sharedKey: Uint8Array) => object | null;
export declare const encryptAESGCM256: (data: object, sharedKey: Uint8Array) => EncryptedData;
/**
 * Calculates PBKDF2 hash
 * @param secret - input
 * @param salt - salt
 * @param iterations - rounds
 */
export declare const pbkdf2: (secret: string, salt: string, iterations: number) => Promise<string>;
export { encryptJSONDataWithSharedKey, tryDecryptJSONDataWithSharedKey, EncryptedData, getPublicViewingKey, ViewingKeyPair, };
