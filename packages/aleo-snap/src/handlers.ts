import { ethErrors } from 'eth-rpc-errors';
import { BIP44CoinTypeNode, getBIP44AddressKeyDeriver, JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import { SHA3 } from 'sha3';
import { Account } from 'aleo-wasm-bundler';

// A conveniant shorthand for a type.
type Bip44Node = BIP44CoinTypeNode | JsonBIP44CoinTypeNode

type AccountInfo = {
    address: string;
    viewKey: string;
}

const makeAccountFromSeed = (seed: string): Account => {
    const hash = new SHA3(256);
    hash.update(seed);
    return Account.from_seed(hash.digest());
}

const makeAccount = (node: Bip44Node, seed: any): AccountInfo => {
    const deriveEthAddress = getBIP44AddressKeyDeriver(node);
    const addressKey0 = deriveEthAddress(0);
    const seedWithBip44 = `${seed}${addressKey0.toString('hex')}`;

    const account = makeAccountFromSeed(seedWithBip44);
    return {
        address: account.to_address(),
        viewKey: account.to_view_key(),
    };
}

const getRandomBytes = (byteCount: number): Int32Array => {
    if (!window.crypto || !window.crypto.getRandomValues) {
        throw new Error('window.crypto.getRandomValues not available');
    }
    const randomBytes = new Int32Array(byteCount);
    window.crypto.getRandomValues(randomBytes);
    return randomBytes;
};

const makeRandomAccount = (): AccountInfo => {
    // We can't use the Account constructor because it relies on the bundled RNG.
    // This RNG in turn attempts to call `process` which is unavailable in this context.
    // const account = new Account();

    // Instead, we use the `getRandomBytes` function to generate a random seed.
    const seed = getRandomBytes(32).toString();
    const account = makeAccountFromSeed(seed);
    return {
        address: account.to_address(),
        viewKey: account.to_view_key(),
    }
}

export const isEnabled = () => {
    return true;
}

export const getAccountFromSeed = (node: Bip44Node, params: any[]) => {
    console.log(`aleo_get_account_from_seed: ${JSON.stringify(params)}`);
    if (!params[0]) {
        return ethErrors.rpc.invalidParams('Missing parameter: seed');
    }
    return makeAccount(node, params[0]);
}

export const getRandomAccount = (): AccountInfo => {
    console.log('aleo_get_random_account');
    return makeRandomAccount();
}

export const signPayload = (params: any[]) => {
    console.log('aleo_sign_payload');
    if (!params[0]) {
        return ethErrors.rpc.invalidParams('Missing parameter: seed');
    }
    const payload = params[0];

    // TODO: Replace this with a persisted account
    const seed = getRandomBytes(32);
    const account = makeAccountFromSeed(seed.toString());
    const signedPayload = account.sign(payload, seed);
    return signedPayload;
}

