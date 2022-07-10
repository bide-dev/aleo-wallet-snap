import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { SHA3 } from 'sha3';
import { Account } from 'aleo-wasm-bundler';

import { getRandomBytes, RNG_SEED_SIZE } from './utils';
import { SnapState } from './state';
import { Bip44Node } from './types';

export interface PublicAccountInfo {
    address: string;
    viewKey: string;
}

export interface PrivateAccountInfo extends PublicAccountInfo {
    privateKey: string;
}

const makeAccountFromSeed = (seed: string): Account => {
    const hash = new SHA3(256);
    hash.update(seed);
    return Account.from_seed(hash.digest());
}

export const makeAccount = (entropy: Bip44Node, seed: any): PublicAccountInfo => {
    const deriveEthAddress = getBIP44AddressKeyDeriver(entropy);
    const addressKey0 = deriveEthAddress(0);
    const seedWithBip44 = `${seed}${addressKey0.toString('hex')}`;

    const account = makeAccountFromSeed(seedWithBip44);
    return {
        address: account.to_address(),
        viewKey: account.to_view_key(),
    };
}

export const makeRandomAccount = async (state: SnapState, entropy: Bip44Node): Promise<PublicAccountInfo> => {
    // We can't use the Account constructor because it relies on the bundled RNG.
    // This RNG in turn attempts to call `process` which is unavailable in this context.
    // const account = new Account();

    // Instead, we use the `getRandomBytes` function to generate a random seed.
    const seed = getRandomBytes(RNG_SEED_SIZE).toString();
    const account = makeAccountFromSeed(seed);
    const accountPublic = {
        address: account.to_address(),
        viewKey: account.to_view_key(),
    }

    // Persist account
    const accountPrivate: PrivateAccountInfo = {
        ...accountPublic,
        privateKey: account.to_private_key(),
    }

    writeAccount(state, accountPrivate);

    return accountPublic;
}

const writeAccount = async (state: SnapState, account: PrivateAccountInfo): Promise<SnapState> => {
    const currentState = state.getState();
    const existingAddresses = currentState.accounts.map(a => a.address);
    if (existingAddresses.includes(account.address)) {
        return state;
    }
    currentState.accounts.push(account);
    await state.setState(currentState);
    return state;
}

export const deleteAccounts = async (state: SnapState, addresses: string[]): Promise<void> => {
    const accounts = state.getState().accounts.filter(account => !addresses.includes(account.address));
    await state.setState({ accounts });
}

export const getAccounts = async (state: SnapState): Promise<PublicAccountInfo[]> => {
    return state.getState().accounts.map(account => ({
        address: account.address,
        viewKey: account.viewKey,
    }));
}

export const deleteAllAccounts = async (state: SnapState): Promise<void> => {
    const addresses = state.getState().accounts.map(account => account.address)
    await deleteAccounts(state, addresses);
}

export const signWithAccount = async (state: SnapState, address: string, message: string): Promise<Uint8Array | null> => {
    const account = state.getState().accounts.find(account => account.address === address);
    if (!account) {
        return null;
    }
    const accountInstance = Account.from_private_key(account.privateKey);
    return accountInstance.sign(message);
}