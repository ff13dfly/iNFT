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

* The PoE(Proof Of Exsistence) sample JSON data.

    ```Javascript
        {
            "salt":"SALT_FROM_CHARGE_SERVER",
            "network":"",
            "account":"ACCOUNT_OF_TARGET_NETWORK",
        }
    ```
