# Anchor Cache Service

- Language: Javascript, support: NodeJS.

- Cache the anchors to local.

## Functions

- Cache iNFT to local. Save as file, one file per hour.

## Deployment

- Server URL: https://api.w3os.net

- Build to min file by `esbuild`.

    ```SHELL
        #Need esbuild support
        yarn add esbuild

        #Tanssi Network package
        ./node_modules/esbuild/bin/esbuild app.js --bundle --minify --outfile=./history.tanssi.min.js --platform=node

        #Anchor Network package
        ./node_modules/esbuild/bin/esbuild app.js --bundle --minify --outfile=./history.anchor.min.js --platform=node
    ```

    ```SHELL
        iptables -I INPUT -p tcp --dport 7766 -j ACCEPT
    ```

- Nignx setting

    ```SHELL

    ```

## Data Structure

### Anchor

- Raw anchor data sample, storage as the data on block.

- Sample.

    ```Javascript
        // redis.hset("raw","ANCHOR_NAME","ANCHOR_DATA")
        {
            tpl:"",
            offset:"",
            target:"",
            signer:"",
            block:0,
            hash:"0x",
        }
    ```

### Block

- Cache the block iNFT list

- Sample.

    ```Javascript
        // redis.hset("block","BLOCk_NUMBER","SAMPLE")
        ["INDEX","NAME","ACTION"]
    ```

### History

- Cache the iNFT history by Anchor name.

- Sample.

    ```Javascript
        // redis.lPush("ANCHOR_NAME","ACTIONS")
        ["BLOCK","INDEX","ACTION","ACCOUNT"]
    ```

### Selling

- Cache the iNFT list by selling status

- Sample.

    ```Javascript
        // redis.lPush("SELLING","ANCHOR_NAME")
        ["PRICE","OWNER"]
    ```

### Template

- Cache the iNFT list by template

- Sample.

    ```Javascript
        // redis.lPush("TEMPLATE_NAME","ANCHOR_NAME")
        "ANCHOR_NAME"
    ```

### Account

- Cache the iNFT list by owner account

- Sample.

    ```Javascript
        // redis.lPush("ACCOUNT_ADDRESS","ANCHOR_NAME")
        "ANCHOR_NAME"
    ```