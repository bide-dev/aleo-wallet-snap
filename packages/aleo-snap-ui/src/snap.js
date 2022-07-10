export const SNAP_ID = __SNAP_ID__; // Injected by webpack.DefinePlugin

const request = async (method, params) => {
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    throw new Error("MetaMask is not installed");
  }

  const result = await window.ethereum.request({ method, params });
  console.log([method, result])
  return result;
}

export const requestSnap = async (method, params) => {
  const result = await request("wallet_invokeSnap", [SNAP_ID, { method, params }]);
  console.log([method, result])
  return result;
}

export const connect = async () => {
  try {
    await request("wallet_enable", [{ wallet_snap: { [SNAP_ID]: {} } }]);
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
    return await requestSnap("aleo_get_account_from_seed", [seed]);
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message || error);
  }
}

export const getRandomAccount = async () => {
  try {
    return await requestSnap("aleo_get_random_account");
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message || error);
  }
}

export const deleteAccount = async (address) => {
  try {
    await requestSnap("aleo_delete_account", [address]);
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message || error);
  }
}

export const deleteAllAccounts = async () => {
  try {
    await requestSnap("aleo_delete_all_accounts");
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message || error);
  }
}

export const getAccounts = async () => {
  try {
    return await requestSnap("aleo_get_accounts");
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message || error);
  }
}

export const signPayload = async (address, payload) => {
  try {
    return await requestSnap("aleo_sign_payload", [address, payload]);
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message || error);
  }
}