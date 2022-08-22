# Aleo Snap Adapter

Checkout [the documentation]() and the `packages/aleo-snap-ui` for an implementation example.

## Getting Started

In order to run this demo, we need to install a modified snap version:

- The newest [MetaMask extension](https://github.com/MetaMask/metamask-extension) that support MetaMask Flask: Checkout
  the newest flask version using tags that match `v*.*.*-flask`, for example `v10.14.0-flask`
- Build the extension locally: `yarn setup && yarn dist --build-type flask`
- Load the unpacked extension (see "custom build" instructions)
  from [here](https://github.com/MetaMask/metamask-extension/tree/eth-denver-2022#other-docs)

## Example

```typescript
import * as snap from "aleo-snap-adapter";

const example = async () => {
    // First, make sure to connect with the snap:
    snap.connect();

    // You can check if snap is already connected anytime using:
    await snap.isEnabled();

    // Now, you can use other methods provided by snap
    const account = await snap.getNewAccount();
    const signed = await snap.signString(account.address, 'hello world!');
}
```
