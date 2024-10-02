# USDT to $ANK Exchange

* Language: Javascript, support: NodeJS.

* Check the USDT transaction, then transfer $ANK to target account.

## Deployment

* Server URL: https://ipfs.w3os.net

* Create task on Jenkins to copy the application and IPFS files to server.

* Build to min file by `esbuild`.

    ```SHELL
        #Need esbuild support
        yarn add esbuild
        ./node_modules/esbuild/bin/esbuild app.js --bundle --minify --outfile=./ipfs_cache.min.js --platform=node
    ```

    ```SHELL
        iptables -I INPUT -p tcp --dport 6677 -j ACCEPT
    ```

## PoE

* The PoE(Proof Of Exsistence) sample JSON data. The owner of anchor is treated as the accept account.

    ```Javascript

        //String format:
        //{"salt":"iVmMlBwToJvNuHrL","network":"ethereum","account":"0xD4C8251C06C5776Fa2B488c6bCbE1Bf819D92d83"}
        {
            "salt":"SALT_FROM_CHARGE_SERVER",
            "network":"ethereum",
            "account":"ACCOUNT_OF_TARGET_NETWORK",   
        }

       
    ```
