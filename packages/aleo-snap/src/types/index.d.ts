import { BIP44CoinTypeNode, JsonBIP44CoinTypeNode } from '@metamask/key-tree';

declare global {
    var wallet: any;
}

// A conveniant shorthand for a type.
export type Bip44Node = BIP44CoinTypeNode | JsonBIP44CoinTypeNode
