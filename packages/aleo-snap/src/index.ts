import { ethErrors } from 'eth-rpc-errors';
import { BIP44CoinTypeNode, JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import * as aleoSdk from 'aleo-wasm-bundler';
import { InitOutput } from 'aleo-wasm-bundler';

import { PROGRAM_WASM_HEX } from './wasm';
import * as handlers from './handlers';

// kudos: https://stackoverflow.com/a/71083193
const arrayBufferFromHex = (hexString: string) => {
  const strBytes = hexString
    .replace(/^0x/i, '')
    .match(/../g) ?? [];
  return new Uint8Array(strBytes.map((byte: string) => parseInt(byte, 16))).buffer;
}


let wasm: InitOutput;
let bipEthNode: BIP44CoinTypeNode | JsonBIP44CoinTypeNode;

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

type RequestObject = { method: any; params: any[]; };

wallet.registerRpcMessageHandler(async (originString: any, { method, params }: RequestObject) => {
  if (!wasm) {
    await initializeWasm();
  }

  if (!bipEthNode) {
    bipEthNode = await wallet.request({
      method: 'snap_getBip44Entropy_60', // Ethereum BIP44 node 
    });
  }

  switch (method) {
    case 'aleo_is_enabled':
      return handlers.isEnabled();

    case 'aleo_get_account_from_seed':
      return handlers.getAccountFromSeed(bipEthNode, params);

    case 'aleo_get_random_account':
      return handlers.getRandomAccount();

    case 'aleo_sign_payload':
      return handlers.signPayload(params);

    default:
      throw ethErrors.rpc.methodNotFound({ data: { request: { method, params } } });
  }
});
