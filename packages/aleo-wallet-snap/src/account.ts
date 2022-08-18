import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { Account } from 'aleo-wasm-bundler';
import { PublicAccount, PublicAccountWithSeed } from 'aleo-snap-adapter';

import { uint8ArrayFromHex, getRandomBytes, RNG_SEED_SIZE, sha256 } from './utils';
import { SnapState } from './state';


export interface PrivateAccount extends PublicAccount {
    privateKey: string;
    seed: string;
}

export const persistAccount = (accountPublic: PublicAccount, account: Account, seed: string, state: SnapState) => {
    const newAccount: PrivateAccount = {
        ...accountPublic,
        privateKey: account.to_private_key(),
        seed
    };
    const newWalletState = state.wallet.importAccount(newAccount);
    state.setState(newWalletState);
}

export const recoverAccount = (state: SnapState, seed: string): PublicAccount => {
    const account = Account.from_seed(Buffer.from(uint8ArrayFromHex(seed)))
    const accountPublic = {
        address: account.to_address(),
        viewKey: account.to_view_key(),
    }
    persistAccount(accountPublic, account, seed, state);
    return accountPublic;
}

export const deriveAccount = (state: SnapState, seedPrefix: string): { account: Account, seed: string } => {
    const deriveEthAddress = getBIP44AddressKeyDeriver(state.entropy);
    const addressKey0 = deriveEthAddress(0);
    const seed = sha256(`${seedPrefix}${addressKey0.toString('hex')}`);
    const account = Account.from_seed(seed);
    return { account, seed: seed.toString('hex') };
}

export const makeNewAccount = async (state: SnapState): Promise<PublicAccount> => {
    const seedPhrase = `account_index_${wallet.accountIndex}`;
    await state.setState(state.wallet.incrementAccountIndex());

    const { account, seed } = deriveAccount(state, seedPhrase);
    const accountPublic = {
        address: account.to_address(),
        viewKey: account.to_view_key(),
    }
    persistAccount(accountPublic, account, seed, state);
    return accountPublic;
}

export const makeRandomAccount = (state: SnapState, entropy: string): PublicAccountWithSeed => {
    const { account, seed } = deriveAccount(state, entropy);
    return {
        address: account.to_address(),
        viewKey: account.to_view_key(),
        seed,
    }
}

export const deleteAccounts = async (state: SnapState, addresses: string[]): Promise<void> => {
    const newWalletState = addresses.reduce(
        (walletState, address) => walletState.deleteAccount(address),
        state.wallet
    );
    await state.setState(newWalletState);
}

export const getAccounts = (state: SnapState): PublicAccount[] => {
    return Object.values(state.wallet.accountMap).map(account => ({
        address: account.address,
        viewKey: account.viewKey,
        seed: account.seed,
    }));
}

export const findSeedForAddress = (state: SnapState, address: string): string | null => {
    const account = state.wallet.accounts.find(a => a.address === address);
    if (!account) {
        return null;
    }
    return account.seed;
}

export const signWithAccount = (state: SnapState, address: string, message: string): Uint8Array | null => {
    const account = state.wallet.accounts.find(a => a.address === address);
    if (!account) {
        return null;
    }
    const accountInstance = Account.from_private_key(account.privateKey);
    const hashedMessage = sha256(message).toString('hex');
    const seed = getRandomBytes(RNG_SEED_SIZE);
    return accountInstance.sign(hashedMessage, seed);
}
