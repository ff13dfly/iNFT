/* 
*  iNFT runtime functions
*  @auth [ Fuu ]
*  @creator Fuu
*  @date 2024-07-05
*  @functions
*  1.auto check wallet;
*  2.not clear definition of this lib
*/

import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import Config from "./config";

const cache={
    address:"",
}

const RUNTIME={
    account:{
        set:(addr)=>{
            cache.address=addr;
        },
        get:()=>{
            return cache.address;
        },
        avatar:(addr)=>{
            const cfg = Config.get(["system", "avatar"]);
            return `${cfg.base}/${addr}.png${cfg.set}`;
        },
    },
    auto:async (ck)=>{
        //1.try to get the account;
        const dapp=Config.get(["system","name"]);

        const extensions = await web3Enable(dapp);
        if (extensions.length === 0) {
            console.log("No extension installed");
            return false;
        }
        const accounts = await web3Accounts();
        if (accounts.length === 0) {
            console.log("No accounts found");
            return false;
        }
        const addr=accounts[0].address;
        RUNTIME.account.set(addr);
        return ck && ck(addr);;
    },
}

export default RUNTIME