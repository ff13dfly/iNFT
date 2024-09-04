# iNFT Multi Chain

## Goal

- Minting on Anchor Network. The result as iNFT can be crossed to Ethereum Network even the Anchor Network is crashed down.

- Block hash on Bitcoin Network. No direct operation on Bicoin Network, just use the block hash as mint hash to generate iNFT.

- Assets on Ethereum Network. It is the target asset network on iNFT system. Need to keep the balance result and generate NFT from iNFT.

## Actions

### ETH Network

- Create a new ERC-20 token called **INFT**, that should be a Smart Contract ( called `evm_erc20_inft` ) on Ethereum Network.

- Swap our ERC-20 token ( **INFT** ) with **USDT**. The application should be a Smart Contract ( called `evm_swap_inft_usdt` ) on Ethereum Network.

### ETH-BTC-Anchor

- Ethereum Network keep the record of relation between Ethereum Salt and Bitcoin Network block height. Ethereum Network fresh the **Salt** frequently via Smart Contract ( called `evm_fresh_salt` ).

- Anchor Network call the Smart Contract ( called `evm_fresh_salt` ) to get the **Salt** data, this function called `offchain_call_evm_on_eth`. At the same time, the application called `merkel_robot.js` will collect all iNFT transaction, including all anchor actions, then calculate the merkel root to storage on Ethereum Network via Smart Contract called `evm_storage_merkel`.

### Anchor Network

- Mint the iNFT with target Bitcoin block number which is limited by Ethereum **Salt**. Then the iNFT is trustable on Bitcoin block hash and can be crossed to Ethereum Network.

- `Set`, `Sell`, `Buy` and `Drop` iNFT on Anchor Network on low gas fee.

### ETH --> Anchor

- Cross **INFT** to Anchor Network ( **ANK** ) via bridge. Sent **INFT** to target account, system confirm the result, then sent **ANK** to related account on Anchor Network. Need to create the relationship between ETH account and Anchor Network account. The application called `inft_to_eth.js` should be NodeJS App.

### Anchor --> ETH

- Cross **ANK** to on Ethereum Network ( **INFT** ) via bridge. Sent **ANK** to target account on Anchor Network, system confirm the transaction, then sent **INFT** to realated account on ETH Network. The application called `eth_to_ank.js` should be NodeJS App.

- Cross iNFT to Ethereum Network need to `drop` the iNFT with `Last Words` on Anchor Network. The related Ethereum account should be included in `Last Words`. After the data is synced to Ethereum Network, call the Smart Contract ( called `evm_generate_iNFT`) to generate a NFT ( ERC-721 standard ) with the leaf data and path of iNFT on Anchor Network.

## Applications

### evm_erc20_inft

### evm_swap_inft_usdt

### evm_fresh_salt

### evm_storage_merkel

### evm_generate_iNFT

### merkel_robot.js

### inft_to_eth.js

### offchain_call_evm_on_eth

## Security

### Fake Anchor Network Data
