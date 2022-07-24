import * as passworder from '@metamask/browser-passworder';
import { Mutex } from 'async-mutex';

import { PrivateAccountInfo } from './account';
import { Bip44Node } from './types';

export interface AppState {
    accounts: PrivateAccountInfo[];
}

const EMPTY_APP_STATE: AppState = {
    accounts: [],
}

export class SnapState {
    private mutex: Mutex;
    public entropy: Bip44Node;
    private _state: AppState;

    constructor(entropy: Bip44Node, state?: AppState) {
        this.entropy = entropy;
        this.mutex = new Mutex();
        this._state = state ?? EMPTY_APP_STATE;
    }

    public static async fromPersisted(entropy: Bip44Node): Promise<SnapState> {
        const appState = await SnapState.readPersisted(entropy);
        return new SnapState(entropy, appState);
    }

    public getState(): AppState {
        return this._state;
    }

    public async setState(newState: AppState): Promise<void> {
        await this.mutex.runExclusive(async () => {
            await this.persist(newState);
            this._state = newState;
        });
    }

    private async persist(newState: AppState) {
        const encryptedState = {
            passwords: await passworder.encrypt(this.entropy.key, newState),
        };
        await wallet.request({
            method: 'snap_manageState',
            params: ['update', encryptedState],
        });
    }

    private static async readPersisted(entropy: Bip44Node): Promise<AppState> {
        const state = await wallet.request({
            method: 'snap_manageState',
            params: ['get'],
        });
        if (state === null) {
            return EMPTY_APP_STATE;
        }
        const oldState: AppState = await passworder.decrypt(entropy.key, state.passwords);
        return oldState;
    }
}

