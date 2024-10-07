module.exports = {
  solidity: "0.8.27",
  networks: {
    development: {
      url: "https://sepolia.infura.io/v3/799349fbc6ff411983d3d1feba0a3bc7", // Replace with your Infura project URL
      accounts: [
        "0x3034cd7cde2906e8485a492391f508fb07bbd6b9eadce665227730130d4bca1c"   // Replace with your MetaMask private key
      ],
      network_id: "*"   // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "pragma"
    }
  }
};