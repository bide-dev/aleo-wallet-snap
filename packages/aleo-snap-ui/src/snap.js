export const SNAP_ID = __SNAP_ID__; // Injected by webpack.DefinePlugin

const request = (method, params) => {
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    throw new Error("MetaMask is not installed");
  }

  return window.ethereum.request({ method, params });
}

export const requestSnap = async (method, params) => {
  return request("wallet_invokeSnap", [SNAP_ID, { method, params }]);
}

export const connect = async () => {
  try {
    const result = await request("wallet_enable", [{ wallet_snap: { [SNAP_ID]: {} } }]);
    console.log({ wallet_enable: result });
  } catch (error) {
    // The `wallet_enable` call will throw if the requested permissions are rejected.
    if (error.code === 4001) {
      console.error("The user rejected the request.");
      alert("The user rejected the request.");
    } else {
      console.error(error);
      alert("Error: " + error.message || error);
    }
  }
}

export const isEnabled = async () => {
  try {
    return await requestSnap("aleo_is_enabled");
  } catch {
    return false;
  }
};

export const getAccountFromSeed = async (seed) => {
  try {
    const account = await requestSnap("aleo_get_account_from_seed", [seed]);
    console.log({ account });
    return account;
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message || error);
  }
}

export const getRandomAccount = async () => {
  try {
    const account = await requestSnap("aleo_get_random_account");
    console.log({ account });
    return account;
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message || error);
  }
}


export const signPayload = async (payload) => {
  try {
    const signedPayload = await requestSnap("aleo_sign_payload", [payload]);
    console.log({ signedPayload });
    return signedPayload;
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message || error);
  }
}
