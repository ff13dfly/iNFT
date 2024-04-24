//import * as Sui from '@mysten/sui.js';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';

let checker = null;
let link = null;
const config = {
    interval: 800,
    defaultNode: "http://127.0.0.1:8899",
}

const funs = {
    
}

const self = {
    init: (network, ck) => {
        
    },

    //connect to Phantom wallet
    wallet: (ck) => {
        
    },
    balance: (addr, ck, net) => {     //get balance from base58 account
        const network=net!==undefined?net:"testnet";
        const client = new SuiClient({
            url: getFullnodeUrl(network),
        });
        client.getBalance({owner:addr}).then((res)=>{
            return ck && ck(res);
        }).catch((error)=>{
            return ck && ck(error);
        });
    },
    generate: (ck, seed) => {
        const pair = new Ed25519Keypair();
        const account={
            address:pair.getPublicKey().toSuiAddress(),
            privateKey:pair.getSecretKey(),
            raw:{
                public:pair.keypair.publicKey,
                private:pair.keypair.secretKey,
                keypair:pair,
            },
        }
        return ck && ck(account);
    },
    divide:()=>{
        
    },
    recover: (u8arr, ck) => {
        const pair = Ed25519Keypair.fromSecretKey(u8arr);
        const account={
            address:pair.getPublicKey().toSuiAddress(),
            privateKey:pair.getSecretKey(),
            raw:{
                public:pair.keypair.publicKey,
                private:pair.keypair.secretKey,
                keypair:pair,
            },
        }
        return ck && ck(account);
    },
    storage: (json, ck, network) => {
        
    },
    transfer: (amount, to, ck, network) => {
        
    },

    //https://sdk.mystenlabs.com/typescript/sui-client#signandexecutetransactionblock
    run: async (sui_contract, args,keypair ,ck, network) => {
        const client = new SuiClient({
            url: getFullnodeUrl(network),
        });
        
        const txb = new TransactionBlock();
        const nargs=[]
        for(let i=0;i<args.length;i++){
            nargs.push(txb.pure(args[i]));
        }

        txb.moveCall({
            target: sui_contract,
            arguments: nargs,
        });

        //console.log(keypair);
        console.log(client);
        //const cfg={client, signer: keypair,onlyTransactionKind:true};
        //const { bytes, signature } = await txb.sign(cfg);
        const result = await client.signAndExecuteTransactionBlock({
            transactionBlock: txb,
            signer: keypair,
            requestType: 'WaitForLocalExecution',
            options: {
                showEffects: true,
            },
        });
        return ck && ck(result);
    },

    //0xc61afbaf7240f61007c6a2ea5d23924a4efc509aed9e49641d59254adf72a72d
    airdrop: async (suiAddr, amount, ck, network) => {
        const res= await requestSuiFromFaucetV0({
            host: getFaucetHost(network),
            recipient: suiAddr,
        });
        //console.log(res);
        return ck && ck(res);
    },
    view: (value, type, ck, net) => {
        
        switch (type) {
            case "account":
                
                break;
            case "transaction":
                
                break;
        
            default:
                break;
        }
    },
    subscribe: (ck,network) => {
        
    },
    backup:()=>{
        const Sui=self;
        //Sui.test();
        Sui.generate((obj)=>{
            console.log(obj);
            // Sui.recover(obj.raw.private.subarray(0,32),(re)=>{
            //   console.log(re);
            // })
            Sui.airdrop(obj.address,0,()=>{

            },'testnet');
        });
    },
    
};

export default self;