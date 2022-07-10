const { promises: fs } = require('fs');
const path = require('path');

const WASM_PATH = path.join(
  __dirname,
  '../../../node_modules/aleo-sdk/sdk_bg.wasm',
);

async function main() {
  const wasmBin = await fs.readFile(WASM_PATH);
  const wasmHex = wasmBin.toString('hex');
  const jsFileString = `
export const PROGRAM_WASM_HEX: string = '${wasmHex}';
`;
  await fs.writeFile('./src/wasm.ts', jsFileString);
}

main();
