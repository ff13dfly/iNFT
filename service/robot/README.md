# Minting Robot

- Language: Javascript, support: NodeJS.

- Minting robot for iNFT, multi accounts to mint iNFTs.

## Airdrop Daily

## Deployment

- Create task on Jenkins to copy the application and accounts to server.

- `robot_setting.json` will storage the basic status of robot.

- `account` folder is used for the account encried files such as `ACCOUNT_ADDRESS.json`.

- Build to min file by `esbuild`.

    ```SHELL
        #Need esbuild support
        yarn add esbuild

        #Package the Tanssi robot
        ./node_modules/esbuild/bin/esbuild tanssi_robot.js --bundle --minify --outfile=./robot_tanssi.min.js --platform=node

        #Package the Anchor robot
        ./node_modules/esbuild/bin/esbuild anchor_robot.js --bundle --minify --outfile=./robot_anchor.min.js --platform=node
    ```

    ```SHELL
        sudo nohup node robot.min.js &
    ```