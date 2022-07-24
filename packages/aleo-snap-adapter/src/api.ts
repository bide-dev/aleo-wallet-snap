import { requestSnap } from "./metamask";
import { PublicAccountInfo } from "./types";

/**
 * Check whether the user has installed the snap.
 */
export const isEnabled = async (): Promise<boolean> => {
    try {
        return await requestSnap("isEnabled");
    } catch {
        return false;
    }
};

/**
 * Recreate an account from a seed.
 * @param seed The seed to use for the account.
 */
export const getAccountFromSeed = async (seed: string): Promise<PublicAccountInfo> => {
    return await requestSnap("getAccountFromSeed", [seed]);
}

/**
 * Create a new account, persist it to the snap, and return the account info.
 **/
export const getRandomAccount = async (): Promise<PublicAccountInfo> => {
    return await requestSnap("getRandomAccount");
}

/**
 * Delete an account persisted in the snap.
 * @param address The address of the account to delete
 **/
export const deleteAccount = async (address: string): Promise<void> => {
    await requestSnap("deleteAccount", [address]);
}

/**
 * Delete all accounts persisted in the snap.
 */
export const deleteAllAccounts = async (): Promise<void> => {
    await requestSnap("deleteAllAccounts");
}

/**
 * Get all accounts persisted in the snap.
 */
export const getAccounts = async (): Promise<PublicAccountInfo[]> => {
    return await requestSnap("getAccounts");
}

/**
 * Sign a string with an account.
 * @param address Address of the account to sign with.
 * @param payload String to sign.
 * @returns Signed bytes.
 */
export const signString = async (address: string, payload: string): Promise<Uint8Array> => {
    return await requestSnap("signString", [address, payload]);
}