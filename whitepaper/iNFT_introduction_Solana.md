# iNFT介绍说明

## 目标

* 标题`iNFT,一种PoW方式的NFT生成方式,抽卡乐透型的公平NFT系统`

* iNFT是一种完全基于数学随机性的NFT，用了IPFS的不可篡改特性来发布基因模版，使用无法预测的区块哈希来作为组合NFT的随机数。基于基因模版的高度自定义，可以创造各种稀缺度的NFT。这就创造了一种不依赖特定区块链网络的数字资产，在不同的网络可以使用同一模版来进行铸造。即同一个标准可以应用在不同的网络上，甚至是完全异构的网络上。

* iNFT可以达到即使铸造的区块链网络掉线，也能被认可的效果。通过确认铸造过程的公平性，可以将iNFT的结果固化到长久可持续的资产链上。当iNFT被固化到资产链后，即使其铸造过程丢失，结果也是可以被认可的。

* iNFT的这种PoW的铸造模式，就像比特币的挖矿过程，通过无数次的计算，最终计算出来了目标哈希，就获取到了出块的奖励，而计算哈希的过程，是无需被保存记录的。使用独立的链进行PoW操作，就是一种合理的选择。

* iNFT完整部署地址：[https://inft.w3os.net](https://inft.w3os.net)

* iNFT测试Minter地址：[https://minter.inft.w3os.net](https://minter.inft.w3os.net)

* iNFT基因模版演示地址：[https://inft.w3os.net/playground/bafkreibtt7ciqypa3vogodmdmvyd3trwajv3l7cqi43yk4hrtgpyopn2e4](https://inft.w3os.net/playground/bafkreibtt7ciqypa3vogodmdmvyd3trwajv3l7cqi43yk4hrtgpyopn2e4)

* 更多相关信息：[https://github.com/ff13dfly/iNFT](https://github.com/ff13dfly/iNFT)

## 团队招募

* **Solana合约开发 (1~2人，共同参与Radar黑客松)**，熟悉Solana的合约开发，实现对接Solana的转账功能等功能，实现跨链验证iNFT的功能（已有如何实现的方案），对接其他Solana关联产品。

* [https://github.com/orgs/CreatorsDAO/discussions/87](https://github.com/orgs/CreatorsDAO/discussions/87)

## 产品说明

## 实现

* 通过“基因模版 + 区块哈希”的方式，来实现公平公正的PoW的iNFT。基因模版，就是对iNFT的定义，存储在IPFS上。区块哈希，是使用区块链网络（比特币网络）的不可预测的区块哈希，对基因模版的组件进行取值，构成最终的NFT图像。

* 采用图层叠加的方式，来实现NFT图像的显示。

### 基因模版

* 采用图层叠加的方式，使用唯一的原始图像，来拼接生成最终的iNFT。模版是一个定义文件，用来说明最终生成NFT的组成部分、拼接方式、取值方式、稀缺系列等数据。基于模版数据，再结合到指定的不可预测的哈希，例如，比特币的块哈希，就可以生成一个NFT。

* 模版数据结构如下

    ```Javascript
        {
            "size":[],
            "cell":"",
        }
    ```

### iNFT数据结构

* iNFT的数据结构如下：

    ```Javascript
        {
            "name":"UNIQUE_NAME",
            "hash":"",
            "network","SELECTED_HASH_NETWORK",
            "template":"IPFS_TEMPLATE",
            "offset":[],
            "salt":"SALT_FOR_MERKEL_TREE",
        }
    ```