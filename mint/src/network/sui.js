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


        //0x306ebe228a984679f0815e7c07fa88c2569f519738838d2108ca6a608b435fe2

        //0x49d80ed919e21bea6377e5d6e3c3823ee817657be4b82762cfcab78e3b15f2cd
        //235,141,120,111,66,11,61,126,72,73,171,204,161,211,64,247,168,85,167,128,48,179,126,138,226,185,220,122,146,61,255,
        //189,149,68,2,157,228,110,35,152,131,49,186,191,219,77,219,224,26,251,163,136,186,61,65,104,120,73,123,87,11,241,135,114
        const network="testnet";
        const signer_private="eb8d786f420b3d7e4849abcca1d340f7a855a78030b37e8ae2b9dc7a923dffbd";
        const signer_address="0x49d80ed919e21bea6377e5d6e3c3823ee817657be4b82762cfcab78e3b15f2cd";

        // Sui.airdrop("0x90d37594861698c9e9e2a6726d1fd7f24945093cc9864cf47752908f0c9f15a9",0,(res)=>{
        //   console.log(res);
        // },network);

        //6eENLu9nsEBy6nzpGByXuJFza5RjTbUSoLKVucKju23A
        // Sui.recover(tools.hexToU8(signer_private),(acc)=>{
        //   const contract="0xd0e626176c05ae3aff2e06719de40367b5bfa37821f5db5b8ea0921ec0260422::bird_nft::mint_to_sender";
        //   const args=["cc","dd","ee"];
        //   Sui.run(contract,args,acc.raw.keypair,(res)=>{
        //     console.log(res);
        //   },network);
        // });

        // Sui.balance(signer_address,(res)=>{
        //   console.log(res);
        // },network);
    },
    
};

export default self;