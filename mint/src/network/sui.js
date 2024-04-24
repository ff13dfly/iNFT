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
    balance: (ss58, ck,network) => {     //get balance from base58 account
        
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

        console.log(client);
        
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
        //console.log(txb);
        const cfg={client, signer: keypair };
        console.log(cfg);

        const bdata =await txb.build(cfg);
        console.log(bdata);
        // const abc=txb.sign(cfg);
        // console.log(abc);

        // const { bytes, signature } = txb.sign({ client, signer: keypair });
        // console.log(bytes);
        // const result = await client.executeTransactionBlock({
        //     transactionBlock: bytes,
        //     signature,
        //     requestType: 'WaitForLocalExecution',
        //     options: {
        //         showEffects: true,
        //     },
        // });
        // return ck && ck(result);
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
        const network=net!==undefined?net:"testnet";
        const client = new SuiClient({
            url: getFullnodeUrl(network),
        });
        switch (type) {
            case "account":
                
                break;

            case "balance":
                client.getBalance({owner:value}).then((res)=>{
                    return ck && ck(res);
                }).catch((error)=>{
                    return ck && ck(error);
                });
                break;
            case "transaction":
                
                break;
        
            default:
                break;
        }
    },
    subscribe: (ck,network) => {
        
    },
    test: (program_id, data_id, owner_id, ck, network) => {
        const client = new SuiClient({ url: getFullnodeUrl('devnet') });
        console.log(client);
        const txb = new TransactionBlock();

        // Object IDs can be passed to some methods like (transferObjects) directly
        txb.transferObjects(['0xSomeObject'], 'OxSomeAddress');
        // txb.object can be used anywhere an object is accepted
        txb.transferObjects([txb.object('0xSomeObject')], 'OxSomeAddress');
        
        txb.moveCall({
            target: '0x2::nft::mint',
            // object IDs must be wrapped in moveCall arguments
            arguments: [txb.object('0xSomeObject')],
        });
        
        // txb.object automaically converts the object ID to receiving transaction arguments if the moveCall expects it
        txb.moveCall({
            target: '0xSomeAddress::example::receive_object',
            // 0xSomeAddress::example::receive_object expects a receiving argument and has a Move definition that looks like this:
            // public fun receive_object<T: key>(parent_object: &mut ParentObjectType, receiving_object: Receiving<ChildObjectType>) { ... }
            arguments: [txb.object('0xParentObjectID'), txb.object('0xReceivingObjectID')],
        });


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