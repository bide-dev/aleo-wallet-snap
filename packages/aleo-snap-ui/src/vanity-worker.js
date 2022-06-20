const { getAccountFromSeed } = require("./snap");

export const makeAccount = async (seed) => {
  const account = await getAccountFromSeed(seed);
  return Promise.resolve({ account, seed });
};
