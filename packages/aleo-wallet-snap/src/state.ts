import * as passworder from '@metamask/browser-passworder';
import { Mutex } from 'async-mutex';

import { PrivateAccount } from './account';
import { Bip44Node } from './types';

export class WalletState {
    constructor(
        public readonly accountIndex: number = 0,
        // address -> account
        public readonly accountMap: Record<string, PrivateAccount> = {}
    ) { }

    public get accounts(): Array<PrivateAccount> {
        return Object.values(this.accountMap);
    }

    public get addresses(): Array<string> {
        return this.accounts.map(a => a.address);
    }

    public importAccount(account: PrivateAccount): WalletState {
        return new WalletState(this.accountIndex, { ...this.accountMap, [account.address]: account });
    }

    public deleteAccount(address: string): WalletState {
        const { [address]: _, ...accounts } = this.accountMap;
        return new WalletState(this.accountIndex, accounts);
    }

    public incrementAccountIndex(): WalletState {
        return new WalletState(this.accountIndex + 1, this.accountMap);
    }
}

export class SnapState {
    private static readonly STATE_VERSION = 0;
    private readonly mutex: Mutex;
    public readonly entropy: Bip44Node;
    private walletState: WalletState;

    constructor(entropy: Bip44Node, walletState?: WalletState) {
        this.entropy = entropy;
        this.mutex = new Mutex();
        this.walletState = walletState ?? new WalletState();
    }

    public get wallet(): WalletState {
        return this.walletState;
    }

    public static async fromPersisted(entropy: Bip44Node): Promise<SnapState> {
        const appState = await SnapState.readPersisted(entropy);
        return new SnapState(entropy, appState);
    }

    private static async readPersisted(entropy: Bip44Node): Promise<WalletState> {
        const state = await request('get');
        if (!state) {
            return new WalletState();
        }
        if (state.version !== SnapState.STATE_VERSION) {
            throw new Error(`Invalid state version: ${state.version}`);
        }
        return await passworder.decrypt(entropy.key, state.encrypted.walletState);
    }

    public async setState(newState: WalletState): Promise<void> {
        await this.mutex.runExclusive(async () => {
            await this.persist(newState);
            this.walletState = newState;
        });
    }

    private async persist(newState: WalletState) {
        const encryptedState = {
            version: SnapState.STATE_VERSION,
            encrypted: {
                walletState: await passworder.encrypt(this.entropy.key, newState)
            },
        };
        await request('update', encryptedState);
    }

    public async deleteWallet(): Promise<void> {
        await this.setState(new WalletState());
    }
}

const request = async (method: 'clear' | 'get' | 'update', newState?: unknown): Promise<any> => {
    if (['get', 'clear'].includes(method) && newState) {
        throw new Error(`Cannot ${method} with newState`);
    }
    if (method == 'update' && !newState) {
        throw new Error('Cannot call update without newState');
    }

    const params = newState ? [method, newState] : [method];
    return await wallet.request({
        method: `snap_manageState`,
        params,
    });
}