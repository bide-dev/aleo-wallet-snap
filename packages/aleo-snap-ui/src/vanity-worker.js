const { getRandomAccount } = require("aleo-snap-adapter");

export const makeAccount = async (entropy) => {
  const account = await getRandomAccount(entropy);
  return Promise.resolve({ account, entropy });
};
