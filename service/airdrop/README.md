# Faucet Service

- Language: Javascript, support: NodeJS.

- Airdrop to request account. Will record daily to avoid DDOS.

- 3 accounts for airdrop, turn by (day%3).

## Airdrop Daily

## Deployment

- Server URL: https://faucet.w3os.net

- Create task on Jenkins to copy the application and accounts to server.

- Build to min file by `esbuild`.

    ```SHELL
        #Need esbuild support
        yarn add esbuild
        ./node_modules/esbuild/bin/esbuild app.js --bundle --minify --outfile=./faucet.min.js --platform=node
    ```

    ```SHELL
        iptables -I INPUT -p tcp --dport 8888 -j ACCEPT
    ```