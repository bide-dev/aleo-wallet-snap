export interface PublicAccountInfo {
    address: string;
    viewKey: string;
}

export type RpcRequest = {
    isEnabled: () => Promise<boolean>;
    getAccountFromSeed: (seed: string) => Promise<PublicAccountInfo>;
    getRandomAccount: () => Promise<PublicAccountInfo>;
    getAccounts: () => Promise<PublicAccountInfo[]>;
    deleteAccount: (address: string) => Promise<void>;
    deleteAllAccounts: () => Promise<void>;
    signString: (address: string, payload: string) => Promise<string>;
};

export type RpcParams = {
    [Key in keyof RpcRequest]: { method: Key; params: Parameters<RpcRequest[Key]> };
}[keyof RpcRequest];

export type RpcMethod = keyof RpcRequest;

export type RpcResponse = {
    [Key in keyof RpcRequest]: ReturnType<RpcRequest[Key]>;
}[keyof RpcRequest];

