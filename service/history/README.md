# Anchor Cache Service

- Language: Javascript, support: NodeJS.

- Cache the anchors to local.

## Deployment

- Server URL: https://api.w3os.net

- Build to min file by `esbuild`.

    ```SHELL
        #Need esbuild support
        yarn add esbuild
        ./node_modules/esbuild/bin/esbuild app.js --bundle --minify --outfile=./history.min.js --platform=node
    ```

    ```SHELL
        iptables -I INPUT -p tcp --dport 7766 -j ACCEPT
    ```

- Nignx setting

    ```SHELL

    ```