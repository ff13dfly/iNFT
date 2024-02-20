# Identifiable NFT ( iNFT in short )

- 数字化的

## Feather

- Need to load **W3API** from local, need to link the API folder to `node_modules`. Be careful, when new package is added to the project, you need to relink the folder.

    ```SHELL
        # change to node_modules folder of UI
        cd node_modules
        
        # add link to NPM
        ln -s ../../../APIs ./w3api
    ```

## 经济模型

- iNFT的作者发布一个iNFT模版，可以供其他使用者使用，每mint一次，就支付一定的费用给作者。**在Anchor上的难点是，如何触发自动付款给作者。**

- iNFT实例化的结果，可以以Anchor的方式进行销售。