const solanaDataProgram=require('solana-data-program');
const SOL = require("@solana/web3.js");
const bs58 = require('bs58');

let link = null;
const self={
    init: (network, ck) => {
        if (link !== null) return ck && ck(link);
        const { Connection, clusterApiUrl } = SOL;
        switch (network) {
            case "devnet":
                link = new Connection(clusterApiUrl('devnet'));
                break;

            default:
                link = new Connection(config.defaultNode, "confirmed");
                break;
        }

        //console.log(link);
        return ck && ck(link);
    },
    recover:(base58String)=>{
        const privateKey=bs58.decode(base58String)
        const arr=Buffer.from(privateKey);
        return  SOL.Keypair.fromSecretKey(arr);
    },
    balance: (pub, ck) => {     //get balance from base58 account

    },
    create:async(feePayer,connection)=>{
        // ix to create the Data Account and keypair of Data Account
        const [createIx, dataAccountKP] = await DataProgram.createDataAccount(
            connection,
            feePayer.publicKey,
            200
        );
        // create transaction with instruction
        const createTx = new Transaction();
        createTx.add(createIx);
    },
}

//key value from Phantom wallet
const test_privateKey="Mp6UoMT9vUeLudtehxyLPNupJrFeMs6QWGtPwXKGR7Lsj5vK3YUbxMKJkyRr6okkGDZzYJRMoX1HmBspJ97YVr7"


self.init("devnet",(connection)=>{
    const signer=self.recover(test_privateKey);
    // connection.getAccountInfo(signer.publicKey).then((accountInfo)=>{
    //     const balance = accountInfo.lamports / 1000000000;
    //     console.log(balance);
    // });

    connection.getSlot().then((block) => {
        console.log('New block received:', block);
        // self.view(block, "block", (block) => {
        //     //console.log(block.blockhash);
        //     return ck && ck(self.ss58ToHex(block.blockhash));
        // }, network);
    })
});

