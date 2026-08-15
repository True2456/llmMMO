/**
 * Web3 Multi-Chain RPC Configuration
 * Configures Layer-2 networks (Base, Polygon, Arbitrum, Sepolia) and Solana
 */

export const NETWORKS = {
  // Base (Coinbase L2)
  BASE_MAINNET: {
    name: 'Base Mainnet',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    currency: 'ETH',
    isTestnet: false
  },
  BASE_SEPOLIA: {
    name: 'Base Sepolia Testnet',
    chainId: 84532,
    rpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia.basescan.org',
    currency: 'ETH',
    isTestnet: true
  },
  // Polygon PoS
  POLYGON: {
    name: 'Polygon PoS',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    currency: 'POL',
    isTestnet: false
  },
  // Sepolia Testnet
  SEPOLIA: {
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
    explorerUrl: 'https://sepolia.etherscan.io',
    currency: 'SEP',
    isTestnet: true
  },
  // Solana
  SOLANA_DEVNET: {
    name: 'Solana Devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
    currency: 'SOL',
    isTestnet: true
  },
  SOLANA_MAINNET: {
    name: 'Solana Mainnet-Beta',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://explorer.solana.com',
    currency: 'SOL',
    isTestnet: false
  }
};

export const DEFAULT_NETWORK = NETWORKS.BASE_SEPOLIA;
