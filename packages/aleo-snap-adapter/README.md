# Aleo Snap Adapter

Checkout [the documentation]() and the `packages/aleo-snap-ui` for an implementation example.

## Getting Started

```typescript
import * as snap from "aleo-snap-adapter";

const example = async () => {
    // First, make sure to connect with the snap:
    snap.connect();

    // You can check if snap is already connected anytime using:
    await snap.isEnabled();
    // Now, you can use other methods provied by snap

    const account = await snap.getNewAccount();
    const signed = await snap.signString(account.address, 'hello world!');
}
```
