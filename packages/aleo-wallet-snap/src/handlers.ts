import { PublicAccount, PublicAccountWithSeed, RpcParams } from 'aleo-snap-adapter';
import { ethErrors } from 'eth-rpc-errors';

import {
    recoverAccount,
    makeNewAccount,
    signWithAccount,
    deleteAccounts,
    findSeedForAddress,
    makeRandomAccount,
} from './account';
import { SnapState } from './state';

export const getAccountFromSeed = (state: SnapState, params: RpcParams) => {
    console.log(`aleo_get_account_from_seed: ${JSON.stringify(params)}`);
    if (!params[0]) {
        throw ethErrors.rpc.invalidParams('Missing parameter: seed');
    }
    return recoverAccount(state, params[0]);
}

export const getNewAccount = async (state: SnapState): Promise<PublicAccount> => {
    console.log('aleo_get_new_account');
    return await makeNewAccount(state);
}

export function getRandomAccount(state: SnapState, params: RpcParams): PublicAccountWithSeed {
    console.log(`aleo_get_random_account: ${JSON.stringify(params)}`);
    if (!params[0]) {
        throw ethErrors.rpc.invalidParams('Missing parameter: entropy');
    }
    const entropy = params[0];
    return makeRandomAccount(state, entropy);
}

export const isEnabled = () => true;

export const getAccounts = (state: SnapState): PublicAccount[] => {
    console.log('aleo_get_accounts');
    return state.wallet.accounts.map(({ address, viewKey }) => ({ address, viewKey, }))
}

export const deleteWallet = async (state: SnapState): Promise<boolean> => {
    console.log('aleo_delete_wallet');
    await state.deleteWallet();
    return true;
}

export const deleteAccount = async (state: SnapState, params: RpcParams): Promise<boolean> => {
    console.log(`aleo_delete_account: ${JSON.stringify(params)}`);
    if (!params[0]) {
        throw ethErrors.rpc.invalidParams('Missing parameter: address');
    }
    const address = params[0];
    await deleteAccounts(state, [address]);
    return true;
}

export function getSeedForAddress(state: SnapState, params: RpcParams): string {
    console.log(`aleo_get_seed_for_address: ${JSON.stringify(params)}`);
    if (!params[0]) {
        throw ethErrors.rpc.invalidParams('Missing parameter: address');
    }

    const address = params[0];
    if (!address) {
        throw ethErrors.rpc.invalidParams(`Account not found: ${address}`);
    }

    return findSeedForAddress(state, address);
}

export const signString = async (state: SnapState, params: RpcParams) => {
    console.log(`aleo_sign_payload: ${JSON.stringify(params)}`);
    if (!params[0]) {
        throw ethErrors.rpc.invalidParams('Missing parameter: address');
    }
    if (!params[1]) {
        throw ethErrors.rpc.invalidParams('Missing parameter: payload');
    }
    const address = params[0];
    const payload = params[1];

    const signedPayload = signWithAccount(state, address, payload);
    if (!signedPayload) {
        throw ethErrors.rpc.invalidParams(`Account not found: ${address}`);
    }

    return signedPayload;
}