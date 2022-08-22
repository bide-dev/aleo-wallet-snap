import * as aleoSdk from 'aleo-wasm-bundler';
import { InitOutput } from 'aleo-wasm-bundler';
import { RpcMethod, RpcParams } from 'aleo-snap-adapter';
import { ethErrors } from 'eth-rpc-errors';

import { PROGRAM_WASM_HEX } from './wasm';
import * as handlers from './handlers';
import { Bip44Node } from './types';
import { SnapState } from './state';
import { uint8ArrayFromHex } from './utils';

let wasm: InitOutput;
let entropy: Bip44Node;
let state: SnapState;

const initializeWasm = async () => {
  try {
    const wasmBuffer = uint8ArrayFromHex(PROGRAM_WASM_HEX);
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
      return handlers.getAccountFromSeed(state, params);

    case "getNewAccount":
      return handlers.getNewAccount(state);

    case "getRandomAccount":
      return handlers.getRandomAccount(state, params);

    case "getAccounts":
      return handlers.getAccounts(state);

    case "getSeedForAddress":
      return handlers.getSeedForAddress(state, params);

    case "deleteAccount":
      return handlers.deleteAccount(state, params);

    case "deleteWallet":
      return handlers.deleteWallet(state);

    case "signString":
      return handlers.signString(state, params);

    default:
      throw ethErrors.rpc.methodNotFound({ data: { request: { method, params } } });
  }
});
