# iNFT, identifiable NFT

## Overview

- It is a new way to mint NFT by block hash and unmodified template file on chain.

- The design of template can make iNFT identifiable.

- As every blockchain network have random block hash, iNFT can be deployed to multi chain. It is pretty interesting that Dapp can balance value between different networks by mathematics scarcity.

- Networks supported.
    1. Anchor Network - Dev
    2. Aptos Network - Dev
    3. Solana Network - Dev

- Try yourself.
    1. [iNFT Template Editor](https://android.im/solana/editor);
    2. [iNFT Minter](https://android.im/solana/minter);
    3. [iNFT Market](https://android.im/solana/market);

## Dapps

### Editor

- It is the tools for designer to set the parameters for iNFT. Only the source image needed, the iNFT parts can be added here.

- Multi networks support, you can write the iNFT template on different blockchain network.

- Single iNFT file upload/download support.

### Minter

- The client Dapp for normal users.

- Customer can explorer the templates, then mint on selected template.

- The list of result can be checked from minter.

- In some network, you can manage your account here.

### Market

- Selling market of iNFT result. Customers can price the NFT themselves.

- Different networks supported.

### Service

#### Faucet

#### API

#### Portal

#### Cache Robot

#### Minting Robot

## Definition of iNFT

- The template of iNFT definition as follow. 

    ```Javascript
        //iNFT template
        {
            type:"2D",              //2D identifiable NFT.
            size:[
                "OUTPUT_SIZE_X",    //iNFT output size X
                "OUTPUT_SIZE_Y"     //iNFT output size Y
            ],
            cell:[
                "CELL_X",    //image grid size X
                "CELL_Y"     //image grid size Y
            ],
            puzzle:[        //pieces of iNFT. Will render by the array order, 0 is the background
                    {
                        value:[      //where to get the number of hash
                            "START",        //start position of hash string
                            "STEP",         //how many string to get from
                            "DIVIDE" ,      //how to divide, result%n, the value of "n"
                            "OFFSET",       //Random number offset to avoid same result
                            ],
                        img:[       //the position of image start, get by order, related ti "hash"
                            "LINE",         //line number of iNFT resource
                            "ROW",          //row number of iNFT resource
                            "LINE_EXT",     //default is 0,optional, line extend 
                            "ROW_EXT"       //default is 0,optional, row extend 
                            ],
                        position:[  //Position of this piece
                            "POSITION_X",   // The X position of this piece on iNFT
                            "POSITION_Y"    // The Y position of this piece on iNFT
                            ],
                        center:[    //this is optional, default is center of cell
                            "X",            //center X position        
                            "Y"             //center Y position     
                        ],
                        rotation:[  //this is optional 
                            "IMAGE_ROTATION",
                            "ROTATION_POSITION_X",
                            "ROTATION_POSITION_Y",
                        ],      
                        scale:1,    //this is optional        
                        fill:1,     //this is optional, wether fill the empty background     
                        color:[     //this is optional
                            "START",        //start position of hash string 
                            "STEP",         //default is 6,optional
                            "DIVIDE",       //optional, reduce the color amount. 
                            ["RED_OFFSET","GREEN_OFFSET","BLUE_OFFSET"]     //optional, adjust the color
                        ],
                        rarity:[            //How the part categoried to series. Parts can be multi used.
                            ["INDEX","INDEX", ... ],    //index parts, such as [0,2,3]
                            ["INDEX","INDEX", ... ],
                            ["INDEX","INDEX", ... ],
                        ]
                    },
                    ...         //iNFT is combined by pieces
                ]
            version:"VERSTION",     //iNFT template
            auth:["AUTH_NAME"]      //auth name list
        }
    ```

## Multi Chain Asset

### Goal

- Create PoW iNFT asset.

- Even the `Anchor Network` crashed, the asset created on `Etherum Network` is also valid.

### Workflow

- Create a `Salt` on `Etherum Network`, it is related to `Bitcoin Network`.

- Using the `Salt` as parameter to mint iNFT on substate `Anchor Network`.

- `Bridge` package the mintings and save the merkel root hash on `Etherum Network`.

- When want to create the asset of iNFT on `Anchor Network`, write the iNFT data and supply the merkel path.

- Validor confirm the iNFT, the iNFT on `Anchor Network` will be dropped then.

### Howto

- `Substrate` chain such as Anchor Network is used to mint the iNFT.

- Bridge will package the mintings and save the merkel tree root on Etherum Network.

- When somebody want to bridge the iNFT on Anchor Network to other blockchain network, just drop the iNFT on Anchor Network and leave the last words about which account to accept the bridged iNFT. Then no need to write the bridge information when it is on Anchor Network.

- By `Last Words` way, the iNFT is simple on Anchor Network.

- Leaf data sample

    ```Javascript
        {
            "orgin":{       //data written on substrate chain
                "name":"ANCHOR_NAME",
                "raw":{
                    "target":"btc",             //mint by Bitcoin Network hash
                    "block":6123456,            //target Bitcoin block height
                    "salt":"SALT_ON_ETHER",     //salt on Etherum Network
                    "offset":[],                //mint offset
                    "tpl":{                     //mint template

                    }
                }
                "protocol":{
                    "fmt":"data",
                    "type":"json",
                    "tpl":"inft",
                },
                "pre":0
            },
            "block":0,                                  //block number of Substrate Network where the iNFT data on
            "hash":"BLOCK_HASH_OF_ANCHOR_NETWORK",      //optional ,target block hash
            "signer":"SIGNER_ON_SUBSTRATE",
        }
    ```

## Resource
