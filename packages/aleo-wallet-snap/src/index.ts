import * as aleoSdk from 'aleo-wasm-bundler';
import { InitOutput } from 'aleo-wasm-bundler';
import { RpcMethod, RpcParams } from 'aleo-snap-adapter';
import { ethErrors } from 'eth-rpc-errors';

import { PROGRAM_WASM_HEX } from './wasm';
import * as handlers from './handlers';
import { Bip44Node } from './types';
import { SnapState } from './state';
import { arrayBufferFromHex } from './utils';

let wasm: InitOutput;
let entropy: Bip44Node;
let state: SnapState;

const initializeWasm = async () => {
  try {
    const wasmBuffer = arrayBufferFromHex(PROGRAM_WASM_HEX);
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    wasm = await aleoSdk.default(wasmModule);
  } catch (error) {
    console.error('Failed to initialize WebAssembly module.', error);
    throw error;
  }
};

type RequestObject = { method: RpcMethod; params: RpcParams };

wallet.registerRpcMessageHandler(async (originString: string, { method, params }: RequestObject) => {
  if (!wasm) {
    await initializeWasm();
  }

  if (!entropy) {
    entropy = await wallet.request({
      method: 'snap_getBip44Entropy_60', // Ethereum BIP44 node 
    });
  }

  if (!state) {
    state = await SnapState.fromPersisted(entropy);
  }

  switch (method) {
    case "isEnabled":
      return handlers.isEnabled();

    case "getAccountFromSeed":
      return handlers.getAccountFromSeed(entropy, params);

    case "getRandomAccount":
      return handlers.getRandomAccount(state, entropy);

    case "getAccounts":
      return handlers.getAccounts(state);

    case "deleteAccount":
      return handlers.deleteAccount(state, params);

    case "deleteAllAccounts":
      return handlers.deleteAllAccounts(state);

    case "signString":
      return handlers.signString(state, params);

    default:
      throw ethErrors.rpc.methodNotFound({ data: { request: { method, params } } });
  }
});
