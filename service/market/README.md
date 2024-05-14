# Market Service

- Language: Javascript, support: NodeJS.

- Overview of iNFTs

- History cache service

## iNFT Index Service

- Index iNFT by [ account, date, template, rarelity ]

## History Cache Service

## Deployment

- Server URL: https://market.w3os.net

- Create task on Jenkins to copy the application and IPFS files to server.

- Build to min file by `esbuild`.

    ```SHELL
        #Need esbuild support
        yarn add esbuild
        ./node_modules/esbuild/bin/esbuild app.js --bundle --minify --outfile=./market.min.js --platform=node
    ```

    ```SHELL
        iptables -I INPUT -p tcp --dport 8866 -j ACCEPT
    ```