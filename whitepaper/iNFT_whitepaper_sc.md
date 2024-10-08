# iNFT白皮书

## 目标

* iNFT是一种完全基于数学随机性的NFT，用了区块链技术的不可篡改特性来发布模版，使用无法预测的区块哈希来作为组合NFT的随机数。创造了一种不依赖特定区块链网络的数字资产，在不同的网络可以使用同一模版来进行铸造。即同一个标准可以应用在不同的网络上，甚至是完全异构的网络上。

* iNFT可以达到即使铸造的区块链网络掉线，也能被认可的效果。通过确认铸造过程的公平性，可以将iNFT的结果固化到长久可持续的资产链上。当iNFT被固化到资产链后，即使其铸造过程丢失，结果也是可以被认可的。

* iNFT的这种铸造模式，类似于PoW，通过不停的铸造来获取到目标结果。就像比特币的挖矿过程，通过无数次的计算，最终计算出来了目标哈希，就获取到了出块的奖励，而计算哈希的过程，是无需被保存记录的。

## 实现

### 模版

* 采用图层叠加的方式，使用模版的原始图像，来拼接生成最终的iNFT。模版是一个定义文件，用来说明最终生成NFT的组成部分、拼接方式、取值方式、稀缺系列等数据。基于模版数据，再结合到指定的不可预测的哈希，例如，比特币的块哈希，就可以生成一个NFT。

* 模版数据结构如下

    ```javascript
        {
            "size":[],
            "cell":"",
        }
    ```

### iNFT数据结构

* iNFT的数据结构如下：

    ```javascript
        {
            "name":"UNIQUE_NAME",
            "hash":"",
            "network","SELECTED_HASH_NETWORK",
            "template":"IPFS_TEMPLATE",
            "offset":[],
            "salt":"SALT_FOR_MERKEL_TREE",
        }
    ```

* 数据的选取

### 铸造网络

* 基于substrate的独立链，使用anchor pallet来实现了iNFT的独立铸造网络。

* 该网络是可抛弃的网络。

### 资产的固化

* 资产验证的实现原理

* 资产固化的实现

### 区块链网络选择

* 使用比特币网络的区块Hash来作为生成NFT的依据。

* 使用以太坊网络作为NFT资产交易的网络。

* 独立的可抛弃的独立区块链网络，用于低成本铸造。

* 使用IPFS网络来保存铸造iNFT的模版文件

## 代币经济

### 基本逻辑

* 发行ERC20的$INFT代币2,000万枚，每枚定价$20。

* 使用桥来购买对应的Anchor网络的代币，在以太坊的网络上转移$INFT到指定的账户，就会在Anchor网络上给对应的$ANK币。

* 在Anchor网络需要重启的时候，用户可以将$ANK再兑换成$INFT。

* 可以在Anchor网络上使用$ANK来交易iNFT的结果，成交之后，$ANK等价的交换成$INFT。

* iNFT可以通过验证的方式转移到以太坊网络，成为一个可以交易的对象。

### 多网络支持

* 可以在其他网络上一样发行ERC20类似代币。那Anchor网络上，就要发行n*2000万的代币。

## 名词说明

* 模版

* 固化

* 区块链网络

## 引用资源