# iNFT Multi Chain

## Goal

* Minting on Anchor Network. The result as iNFT can be crossed to Ethereum Network even the Anchor Network is crashed down.

* Block hash on Bitcoin Network. No direct operation on Bicoin Network, just use the block hash as mint hash to generate iNFT.

* Assets on Ethereum Network. It is the target asset network on iNFT system. Need to keep the balance result and generate NFT from iNFT.

## Local Test Envirment

### Truffle

* Install the development framework `truffle`.

    ```BASH
        # install truffle by NPM
        npm install -g truffle

        # check the result
        truffle version

        # Got the result on my macbook.
        #! Truffle v5.11.5 (core: 5.11.5)
        #! Ganache v7.9.1
        #! Solidity v0.5.16 (solc-js)
        #! Node v20.12.1
        #! Web3.js v1.10.0
    ```

### Ganache

* Install `Ganache` for local testing.

   ```BASH
        # install truffle by NPM
        npm install -g ganache

        # run Ganache
        ganache

        # Got the result on my macbook.
        <!-- ganache v7.9.2 (@ganache/cli: 0.10.2, @ganache/core: 0.10.2)
        Starting RPC server

        Available Accounts
        ==================
        (0) 0x305a035434370368ABE972bEaafB74a094cfACAb (1000 ETH)
        (1) 0xb8124304c6FDA6BDbb6D617bb666fc75e5aC1e9f (1000 ETH)
        (2) 0x2ad921e256872764a5289852f3e097DfBb73712e (1000 ETH)
        (3) 0x4a4A89A1718cD00DB387F5C2e2a9953671dAe11e (1000 ETH)
        (4) 0x838216C0CC091f388671793131bc1Ad00303b04d (1000 ETH)
        (5) 0xc3883563d9020A4a643402b0B9Fa3ac15d9aD9eC (1000 ETH)
        (6) 0x9Eb16814Bba2eA345Bf9dCEbb352751aC81FbcFa (1000 ETH)
        (7) 0xc5205A3f3A1e327B54737c5f682b2317a2EFD4A7 (1000 ETH)
        (8) 0x19BA544aA50eD43B57e6aaB70e3b7788470a9253 (1000 ETH)
        (9) 0x86E6D3c6eE0234557bE4049e03BBbD63d20Aeb22 (1000 ETH)

        Private Keys
        ==================
        (0) 0x3ea7d602e66777ccb1fdaa352cb7205901e70699f663c60cde6ebdda11d4eab9
        (1) 0xc09f07a07aa8941f6ea0b1e71b324df88c988b963b7c54b6cfdb97b20ab9f771
        (2) 0xb3d76a8cdb2f7476fa0e90114d22e71c6f65e5c1f3c6d6440a999ca60beb7fad
        (3) 0x558a6a8262e966168b4fe94b76543738ea03982a1d42430cee22596f41603f27
        (4) 0x93e715aedfec08e19cd8da8f529808cd05098dbee26927c37b2c2a003c222412
        (5) 0xc3b62fe8d318de1470941a08457bc330f4de61a79fa51a3648690c0d7364f904
        (6) 0x51f0a4c75c96ef7efeb398831b75d6dcadbd8dfd2167e9a0b3caeeed7e651b30
        (7) 0x4f72a0db9db16816282e004f74c895fb5a0cd3059d994766739af5d3426181bb
        (8) 0x49ee0e99abe1b9d08fbb2ba2b2b517befd243130b51ba3c97abb11dbadf41864
        (9) 0xfec3136a5b4b6cb566fa9422bb905c2711fab9d3be839459a89d8d52b46ec21e

        HD Wallet
        ==================
        Mnemonic:      direct nerve devote wasp fun shaft slow flag perfect mimic vehicle renew
        Base HD Path:  m/44'/60'/0'/0/{account_index}

        Default Gas Price
        ==================
        2000000000

        BlockGas Limit
        ==================
        30000000

        Call Gas Limit
        ==================
        50000000

        Chain
        ==================
        Hardfork: shanghai
        Id:       1337

        RPC Listening on 127.0.0.1:8545 -->
    ```

### Explorer

* [https://github.com/gobitfly/etherchain-light.git](https://github.com/gobitfly/etherchain-light.git), setting on `config.json`.

    ```Javascript
        {
            "ethereum": {
                "rpc": "http://localhost:8545" // Ganache RPC URL
            },
            "web": {
                "port": 3000
            }
        }
    ```

* [https://etherscan.io/](https://etherscan.io/), no local node support.

* There is `BlockScout` suggested by ChatGTP4go, [https://github.com/blockscout/blockscout.git](https://github.com/blockscout/blockscout.git). `Mix` is complex to install, will try later.

    ```BASH
        # install mix
        brew install mix

        # run blockscout
        mix phx.server
    ```

### DApp

* Make a directory to saving the solidty code. Then init the project.

    ```BASH
        # Init the solidty project
        truffle init

        # Compiling the project
        truffle compile

        # Deploy the smart contract. 
        # Need to set the `truffle-config.js`
        # Need to add `2_deploy_contracts.js` in `migrations` folder
        # At the first time, will download the libs.
        truffle migrate

        # Get the result of deployment
        <!-- Starting migrations...
        ======================
        > Network name:    'development'
        > Network id:      1726021008214
        > Block gas limit: 30000000 (0x1c9c380)


        2_deploy_contracts.js
        =====================

        Deploying 'MyContract'
        ----------------------
        > transaction hash:    0x4c95b857a6430761e00c33febcb4334b01bbba83768a493ed17b25b7c3b507fd
        > Blocks: 0            Seconds: 0
        > contract address:    0x775098a71815d7664989ABEBa8E57972D37Dd77c
        > block number:        1
        > block timestamp:     1726021903
        > account:             0x305a035434370368ABE972bEaafB74a094cfACAb
        > balance:             999.998505121375
        > gas used:            442927 (0x6c22f)
        > gas price:           3.375 gwei
        > value sent:          0 ETH
        > total cost:          0.001494878625 ETH

        > Saving artifacts
        -------------------------------------
        > Total cost:      0.001494878625 ETH

        Summary
        =======
        > Total deployments:   1
        > Final cost:          0.001494878625 ETH -->

        # Test the deployed smart contract
        truffle console
    ```

    ```Javascript
        let instance = await MyContract.deployed()
        let message = await instance.message()
        console.log(message)
        await instance.updateMessage('New Message')
        message = await instance.message()
        console.log(message)

        //Got the response, when `await instance.updateMessage('New Message')`
        {
            tx: '0x6f80b1795287f81e666affd7f8974c1b9ae7c0cb15e69e5862778b6ed98733be',
            receipt: {
                transactionHash: '0x6f80b1795287f81e666affd7f8974c1b9ae7c0cb15e69e5862778b6ed98733be',
                transactionIndex: 0,
                blockNumber: 2,
                blockHash: '0x9a87ff776c3da3aeb2c6c1025b35266d934bf9b648fd63e860bb5dbbc6ebade1',
                from: '0x305a035434370368abe972beaafb74a094cfacab',
                to: '0x775098a71815d7664989abeba8e57972d37dd77c',
                cumulativeGasUsed: 28126,
                gasUsed: 28126,
                contractAddress: null,
                logs: [],
                logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                status: true,
                effectiveGasPrice: 3268854677,
                type: '0x2',
                rawLogs: []
            },
            logs: []
        }
    ```

### Development

* The most easy way is to access [Remix](https://remix.ethereum.org/).

## Actions

### ETH Network

* Create a new ERC-20 token called **INFT**, that should be a Smart Contract ( called `evm_erc20_inft` ) on Ethereum Network.

* Swap our ERC-20 token ( **INFT** ) with **USDT**. The application should be a Smart Contract ( called `evm_swap_inft_usdt` ) on Ethereum Network.

### ETH-BTC-Anchor

* Ethereum Network keep the record of relation between Ethereum Salt and Bitcoin Network block height. Ethereum Network fresh the **Salt** frequently via Smart Contract ( called `evm_fresh_salt` ).

* Anchor Network call the Smart Contract ( called `evm_fresh_salt` ) to get the **Salt** data, this function called `offchain_call_evm_on_eth`. At the same time, the application called `merkel_robot.js` will collect all iNFT transaction, including all anchor actions, then calculate the merkel root to storage on Ethereum Network via Smart Contract called `evm_storage_merkel`.

### Anchor Network

* Mint the iNFT with target Bitcoin block number which is limited by Ethereum **Salt**. Then the iNFT is trustable on Bitcoin block hash and can be crossed to Ethereum Network.

* `Set`, `Sell`, `Buy` and `Drop` iNFT on Anchor Network on low gas fee.

### ETH --> Anchor

* Cross **INFT** to Anchor Network ( **ANK** ) via bridge. Sent **INFT** to target account, system confirm the result, then sent **ANK** to related account on Anchor Network. Need to create the relationship between ETH account and Anchor Network account. The application called `inft_to_eth.js` should be NodeJS App.

### Anchor --> ETH

* Cross **ANK** to on Ethereum Network ( **INFT** ) via bridge. Sent **ANK** to target account on Anchor Network, system confirm the transaction, then sent **INFT** to realated account on ETH Network. The application called `eth_to_ank.js` should be NodeJS App.

* Cross iNFT to Ethereum Network need to `drop` the iNFT with `Last Words` on Anchor Network. The related Ethereum account should be included in `Last Words`. After the data is synced to Ethereum Network, call the Smart Contract ( called `evm_generate_iNFT`) to generate a NFT ( ERC-721 standard ) with the leaf data and path of iNFT on Anchor Network.

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
