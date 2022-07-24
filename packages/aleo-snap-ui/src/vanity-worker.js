const { getAccountFromSeed } = require("aleo-snap-adapter");

export const makeAccount = async (seed) => {
  const account = await getAccountFromSeed(seed);
  return Promise.resolve({ account, seed });
};
