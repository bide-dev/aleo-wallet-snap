const { ethErrors } = require('eth-rpc-errors');
const { getBIP44AddressKeyDeriver } = require('@metamask/key-tree');
const { SHA3 } = require('sha3');
const aleo = require('aleo-wasm-bundler');

const { PROGRAM_WASM_HEX } = require('./wasm');

// kudos: https://stackoverflow.com/a/71083193
function arrayBufferFromHex(hexString) {
  return new Uint8Array(
    hexString
      .replace(/^0x/i, '')
      .match(/../g)
      .map((byte) => parseInt(byte, 16)),
  ).buffer;
}

let wasm;
let bipEthNode;

const initializeWasm = async () => {
  try {
    const wasmBuffer = arrayBufferFromHex(PROGRAM_WASM_HEX);
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    wasm = await aleo.default(wasmModule);
  } catch (error) {
    console.error('Failed to initialize WebAssembly module.', error);
    throw error;
  }
};

function makeAccount(seed) {
  const deriveEthAddress = getBIP44AddressKeyDeriver(bipEthNode);
  const addressKey0 = deriveEthAddress(0);
  const seedWithBip44 = `${seed}${addressKey0.toString('hex')}`;

  const hash = new SHA3(256);
  hash.update(seedWithBip44);
  const buffer = hash.digest();
  const account = aleo.Account.from_seed(buffer);
  const result = {
    address: account.to_address(),
    view_key: account.to_view_key(),
  };
  console.log(`makeAccount: ${JSON.stringify(result)}`);
  return result;
}

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
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
