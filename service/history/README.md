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