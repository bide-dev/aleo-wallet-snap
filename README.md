# Aleo Web Wallet Snap

![Project logo](logo.png)

## Development

Install dependencies for all packages

```
yarn install
```

Build packages in development mode with hot code reloading

```
yarn dev
```

## Publishing

```
yarn version:snap

# Note the version outputed by the commmand above
# Use it to bump rest of packages in the workspace:
yarn version:others <version>

yarn publish
```

## Demo

[Aleo Web Wallet Snap](https://aleo-snap.netlify.app/)

### Demo Instructions

In order to use snaps, we need to install [MetaMask Flask](https://metamask.io/flask/) extension:

- Checkout [MetaMask extension](https://github.com/MetaMask/metamask-extension) that support MetaMask Flask: We're currently using `v10.14.0-flask`
- Build the extension locally: `yarn setup && yarn dist --build-type flask`
- Load the unpacked extension (see "custom build" instructions)
  from [here](https://github.com/MetaMask/metamask-extension/tree/eth-denver-2022#other-docs)

## Other related repositories

- [piotr-roslaniec/aleo](https://github.com/piotr-roslaniec/aleo) - Aleo SDK fork
- [piotr-roslaniec/snarkVM](https://github.com/piotr-roslaniec/snarkVM) - snarkVM fork - Used in `piotr-roslaniec/aleo`
