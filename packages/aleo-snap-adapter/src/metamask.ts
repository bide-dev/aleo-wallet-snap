import { RpcParams } from "./types";
import { SNAP_ID } from "./consts";

declare global {
    interface Window {
        ethereum: {
            isMetaMask: boolean;
            request: (request: unknown | { method: string; params?: any[] }) => Promise<any>;
        };
    }
}

const request = async (method: string, params: any[]) => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error("MetaMask is not installed");
    }

    const result = await window.ethereum.request({ method, params });
    console.log([method, params, result])
    return result;
}

export function requestSnap<T extends RpcParams, U>(
    method: T["method"],
    params?: T["params"],
): Promise<U> {
    const result = request("wallet_invokeSnap", [SNAP_ID, { method, params }]);
    console.log({ method, params, result });
    return result;
}

/**
 * Connect to snap. Attempts to install the snap if needed.
 * @throws If fails to connect
 */
export const connect = async () => {
    try {
        await request("wallet_enable", [{ wallet_snap: { [SNAP_ID]: {} } }]);
    } catch (error) {
        // The `wallet_enable` call will throw if the requested permissions are rejected.
        if ((error as any).code === 4001) {
            console.error("The user rejected the request.");
            alert("The user rejected the request.");
        } else {
            console.error(error);
            alert("Error: " + (error as any).message || error);
        }
        throw error;
    }
}
