# Aleo Web Wallet Snap

![Project logo](logo.png)

Other related repositories

- [piotr-roslaniec/aleo](https://github.com/piotr-roslaniec/aleo) - Aleo SDK fork
- [piotr-roslaniec/snarkVM](https://github.com/piotr-roslaniec/snarkVM) - snarkVM fork - Used in `piotr-roslaniec/aleo`

## Development

Install dependencies for all packages

```
yarn install
```

Build packages in development mode with hot code reloading

```
yarn dev
```

## How it works

![Snap diagram](snap-diagram.png)

## Demo

[Aleo Web Wallet Snap](https://aleo-snap.netlify.app/)

### Demo Instructions

In order to run this demo, we need to install a modified snap version:

- The newest [MetaMask extension](https://github.com/MetaMask/metamask-extension) that support MetaMask Flask: Checkout the newest flask version using tags that match `v*.*.*-flask`, for example `v10.14.0-flask`
- Build the extension locally: `yarn setup && yarn dist --build-type flask`
- Load the unpacked extension (see "custom build" instructions) from [here](https://github.com/MetaMask/metamask-extension/tree/eth-denver-2022#other-docs)