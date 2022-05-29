import { ethErrors } from 'eth-rpc-errors';
import { BIP44CoinTypeNode, getBIP44AddressKeyDeriver, JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import { SHA3 } from 'sha3';
import initAleoSdk, { InitOutput, Account } from 'aleo-sdk';

import { PROGRAM_WASM_HEX } from './wasm';

// kudos: https://stackoverflow.com/a/71083193
function arrayBufferFromHex(hexString: string) {
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
    wasm = await initAleoSdk(wasmModule);
  } catch (error) {
    console.error('Failed to initialize WebAssembly module.', error);
    throw error;
  }
};

function makeAccount(seed: any) {

  const deriveEthAddress = getBIP44AddressKeyDeriver(bipEthNode);
  const addressKey0 = deriveEthAddress(0);
  const seedWithBip44 = `${seed}${addressKey0.toString('hex')}`;

  const hash = new SHA3(256);
  hash.update(seedWithBip44);
  const buffer = hash.digest();
  const account = Account.from_seed(buffer);
  const result = {
    address: account.to_address(),
    view_key: account.to_view_key(),
  };
  console.log(`makeAccount: ${JSON.stringify(result)}`);
  return result;
}

wallet.registerRpcMessageHandler(async (originString: any, requestObject: { method: any; params: any[]; }) => {
  if (!wasm) {
    await initializeWasm();
  }

  switch (requestObject.method) {
    case 'aleo_get_account':
      console.log(`aleo_get_account: ${JSON.stringify(requestObject.params)}`);
      if (!requestObject.params[0]) {
        return ethErrors.rpc.invalidParams('Missing parameter: seed');
      }

      bipEthNode = await wallet.request({
        method: 'snap_getBip44Entropy_60',
      });

      return makeAccount(requestObject.params[0]);
    default:
      throw ethErrors.rpc.methodNotFound({ data: { request: requestObject } });
  }
});
