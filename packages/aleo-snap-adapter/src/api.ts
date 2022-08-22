import { requestSnap } from "./metamask";
import { PublicAccount } from "./types";

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
 * Recreate an account from a seed, persist it, and return the account info.
 * @param seed The hex-encoded account seed bytes.
 * @returns Recovered account public info.
 */
export const getAccountFromSeed = async (seed: string): Promise<PublicAccount> => {
    return await requestSnap("getAccountFromSeed", [seed]);
}

/**
 * Create a random account without persisting it, and return the account info and seed.
 * @param entropy Deterministic element to use in account generation.
 * @returns Recovered account public info.
 */
 export const getRandomAccount = async (entropy: string): Promise<PublicAccount> => {
    return await requestSnap("getRandomAccount", [entropy]);
}

/**
 * Create a new account according to the account index, persist it to the snap, and return the account info.
 * @returns New account public info.
 **/
export const getNewAccount = async (): Promise<PublicAccount> => {
    return await requestSnap("getNewAccount");
}

/**
 * Delete an account persisted in the snap.
 * @param address The address of the account to delete
 * @throws If the account is not found.
 **/
export const deleteAccount = async (address: string): Promise<void> => {
    await requestSnap("deleteAccount", [address]);
}

/**
 * Delete wallet persisted in the snap.
 */
export const deleteWallet = async (): Promise<void> => {
    await requestSnap("deleteWallet");
}

/**
 * Get all accounts persisted in the snap.
 * @returns An array of public account info.
 */
export const getAccounts = async (): Promise<PublicAccount[]> => {
    return await requestSnap("getAccounts");
}

/**
 * Get an account seed corresponding to the given address.
 * @param address Address of the account to recover seed phrase from.
 * @returns Hex-encoded account seed bytes.
 * @throws If the account is not found.
 */
export const getSeedForAddress = async (address: string): Promise<string> => {
    return await requestSnap("getSeedForAddress", [address]);
}

/**
 * Sign a string with an account.
 * @param address Address of the account to sign with.
 * @param payload String to sign.
 * @returns Signed bytes.
 * @throws If the account is not found.
 */
export const signString = async (address: string, payload: string): Promise<Uint8Array> => {
    return await requestSnap("signString", [address, payload]);
}
