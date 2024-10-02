# Temaplate Cache Service

* Language: Javascript, support: NodeJS.

* Cache the IPFS files.

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
        iptables -I INPUT -p tcp --dport 8188 -j ACCEPT
    ```

* Nignx setting

    ```SHELL

    ```