/**
 * Web3 Smart Contracts & Token Bridge
 * Manages in-game Gold (ERC-20 / SPL) and Rare Item NFTs (ERC-721 / ERC-1155 / Metaplex)
 */

export const REALM_GOLD_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export const REALM_ARTIFACTS_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function mintArtifact(address to, uint256 artifactTypeId, string uri) returns (uint256)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "event ArtifactMinted(address indexed owner, uint256 indexed tokenId, uint256 artifactTypeId)"
];

// Contract addresses on Base Sepolia and Polygon
export const CONTRACT_ADDRESSES = {
  BASE_SEPOLIA: {
    REALM_GOLD: "0x3a4Fa581C80aB7aA686B124B517865c3B5A109D2",
    REALM_ARTIFACTS: "0x82C7991D4C13b190f8452DDe019253457a41B532"
  },
  POLYGON: {
    REALM_GOLD: "0x4F79815049B61E283592C7873D72Ce46985C20A9",
    REALM_ARTIFACTS: "0x78923aA3297f64D908F873523AbB8898127393d2"
  }
};

export class TokenBridge {
  constructor() {
    this.depositLedger = new Map();
  }

  /**
   * Generates a verified minting voucher for an in-game rare drop (e.g. Dragon Longsword, Party Hat).
   */
  generateMintVoucher(playerAddress, item) {
    const timestamp = Date.now();
    const voucher = {
      playerAddress,
      itemId: item.id,
      itemName: item.name,
      itemTier: item.tier || 'Dragon',
      timestamp,
      nonce: Math.floor(Math.random() * 1000000)
    };
    return voucher;
  }

  /**
   * Calculates on-chain $GOLD conversion from in-game coins.
   * 100 in-game coins = 1.0 $REALM Gold
   */
  calculateTokensFromCoins(coins) {
    return (coins / 100).toFixed(2);
  }
}
