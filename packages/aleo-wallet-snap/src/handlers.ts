import { PublicAccountInfo, RpcParams } from 'aleo-snap-adapter';
import { EthereumRpcError, ethErrors } from 'eth-rpc-errors';

import {
    makeAccount,
    makeRandomAccount,
    deleteAllAccounts as deleteAllAccountsFromState,
    signWithAccount,
    deleteAccounts as deleteAccountsFromState,
} from './account';
import { SnapState } from './state';
import { Bip44Node } from './types';

type Error = EthereumRpcError<unknown>

export const getAccountFromSeed = (entropy: Bip44Node, params: RpcParams) => {
    console.log(`aleo_get_account_from_seed: ${JSON.stringify(params)}`);
    if (!params[0]) {
        return ethErrors.rpc.invalidParams('Missing parameter: seed');
    }
    return makeAccount(entropy, params[0]);
}

export const getRandomAccount = async (state: SnapState, entropy: Bip44Node): Promise<PublicAccountInfo> => {
    console.log('aleo_get_random_account');
    return await makeRandomAccount(state, entropy);
}

export const signString = async (state: SnapState, params: RpcParams) => {
    console.log(`aleo_sign_payload: ${JSON.stringify(params)}`);
    if (!params[0]) {
        return ethErrors.rpc.invalidParams('Missing parameter: address');
    }
    if (!params[1]) {
        return ethErrors.rpc.invalidParams('Missing parameter: payload');
    }
    const address = params[0];
    const payload = params[1];

    const signedPayload = signWithAccount(state, address, payload);
    if (!signedPayload) {
        return ethErrors.rpc.invalidParams(`Account ${address} not found`);
    }

    return signedPayload;
}

export const isEnabled = () => {
    return true;
}

export const getAccounts = (state: SnapState): PublicAccountInfo[] => {
    console.log('aleo_get_accounts');
    return state.getState().accounts.map(account => ({
        address: account.address,
        viewKey: account.viewKey,
    }));
}

export const deleteAllAccounts = async (state: SnapState): Promise<boolean> => {
    console.log('aleo_delete_all_accounts');
    await deleteAllAccountsFromState(state);
    return true;
}

export const deleteAccount = async (state: SnapState, params: RpcParams): Promise<boolean | Error> => {
    console.log(`aleo_delete_account: ${JSON.stringify(params)}`);
    if (!params[0]) {
        return Promise.resolve(ethErrors.rpc.invalidParams('Missing parameter: address'));
    }
    const address = params[0];
    await deleteAccountsFromState(state, [address]);
    return true;
}
