const {DataProgram}=require('solana-data-program');
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
    task:async(trans,signer,connection,ck,more)=>{
        const cfg={
            skipPreflight: true,
            preflightCommitment: "confirmed",
            confirmation: "confirmed",
          }
        const sns=[signer];
        if(more!==undefined) sns.push(more);
        const txid = await SOL.sendAndConfirmTransaction(connection, trans, sns,cfg);
        return ck && ck(txid);
    },
    create:async(feePayer,connection,ck)=>{
        const [createIx, dataAccountKP] = await DataProgram.createDataAccount(
            connection,
            feePayer.publicKey,
            200
        );
        const createTx = new SOL.Transaction();
        createTx.add(createIx);

        //console.log(createIx);

        self.task(createTx,feePayer,connection,(tx)=>{
            return ck && ck(dataAccountKP,tx);
        },dataAccountKP);
    },
    initialize:(feePayer,dataAccountKP,ck)=>{
        // get the associated Metadata PDA Account
        const [pdaData] = DataProgram.getPDA(dataAccountKP.publicKey);
        // ix to initialize the Data Account and Metadata Account
        const initializeIx = DataProgram.initializeDataAccount(
            feePayer.publicKey,
            dataAccountKP.publicKey,
            feePayer.publicKey,       //Authority account?
            true, // This assumes the Data Account is precreated. Change this to false if you want to create and initialize Data Account
            true, // The Data Account is set to be dynamic (i.e., can be realloc-ed up or down)
            200
        );
        const initializeTx = new SOL.Transaction();
        initializeTx.add(initializeIx);

        //console.log(pdaData);

        console.log(`Storage PDA account public key: ${pdaData.toString()}`)
        //console.log(`Storage account secret key: ${bs58.encode(pdaData.secretKey)}`);

        return  ck && ck(pdaData);
    },
    update:async(feePayer,dataAccountKP,connection,data,ck)=>{
        const updateIx = DataProgram.updateDataAccount(
            feePayer.publicKey,
            dataAccountKP.publicKey,
            1,     //DataType, 1 = JSON
            Buffer.from(JSON.stringify(data)),      //Need to convert to String  
            //data,
            0,      //offset
            false,  // reallocDown is false. Set to true if Data Account is dynamic and should realloc down
            true   // verifyFlag is false. Set to true to see if the data conforms to its data type
        );
        // create transaction with instruction
        const trans = new SOL.Transaction();
        trans.add(updateIx);

        console.log(updateIx);

        self.task(trans,feePayer,connection,(tx)=>{
            return ck && ck(tx);
        });
    },
    authority:async()=>{
        // ix to update authority of Data Account
        const updateAuthIx = DataProgram.updateDataAccountAuthority(
            authority.publicKey, // old authority
            dataAccount.publicKey,
            newAuthority.publicKey // new authority
        );
        // create transaction with instruction
        const updateAuthTx = new Transaction();
        updateAuthTx.add(updateAuthIx);
    },
    finalize:async()=>{
        // ix to finalize data of Data Account
        const finalizeIx = DataProgram.finalizeDataAccount(
            authority.publicKey,
            dataAccount.publicKey
        );
        // create transaction with instruction
        const finalizeTx = new Transaction();
        finalizeTx.add(finalizeIx);
    },
    close:async()=>{
        // ix to close Data Account and associated Metadata PDA Account
        const closeIx = DataProgram.closeDataAccount(
            authority.publicKey,
            dataAccount.publicKey
        );
        // create transaction with instruction
        const closeTx = new Transaction();
        closeTx.add(closeIx);
    },
    view:async(dataKey,connection)=>{
        
        // extract Data Account's metadata
        const meta = await DataProgram.parseMetadata(connection, dataKey, "confirmed");
        console.log(meta);
        // extract Data Account's data
        const data = await DataProgram.parseData(connection, dataKey, "confirmed");
        console.log(data.toString('utf-8'));
        //console.log(bs58.decode(data.toString()));
    },
}

//key value from Phantom wallet
const test_privateKey="Mp6UoMT9vUeLudtehxyLPNupJrFeMs6QWGtPwXKGR7Lsj5vK3YUbxMKJkyRr6okkGDZzYJRMoX1HmBspJ97YVr7"

self.init("devnet",(connection)=>{
    const signer=self.recover(test_privateKey);
    console.log(`Signer account public key: ${signer.publicKey.toString()}`)
    console.log(`Signer account secret key: ${bs58.encode(signer.secretKey)}`);

    connection.getAccountInfo(signer.publicKey).then((accountInfo)=>{
        const balance = accountInfo.lamports / 1000000000;
        console.log(`Account ${signer.publicKey.toString()}:`,balance);
    });

    connection.getSlot().then((block) => {
        console.log('New block received:', block);
        // const dataKey="ECQd7f4sYhcWX5G9DQ7Hgcf3URZTfgwVwjKzH2sMQeFW";
        // const pubData=new SOL.PublicKey(dataKey);
        // self.view(pubData,connection);

        self.create(signer,connection,(dataAccountKP,txHash)=>{
            console.log(`New data account publish key: ${dataAccountKP.publicKey.toString()}, transaction: ${txHash}`);
            const data={"hello":"good day"};
            self.update(signer,dataAccountKP,connection,data,(hash)=>{
                console.log(`Saving ${JSON.stringify(data)}, transaction: ${hash}`);
            })
        });
        
        // self.create(signer,connection).then((dataAccountKP)=>{
        //     console.log(`Storage account public key: ${dataAccountKP.publicKey.toString()}`)
        //     console.log(`Storage account secret key: ${bs58.encode(dataAccountKP.secretKey)}`);
        //     self.initialize(signer,dataAccountKP,(pdaData)=>{
        //         console.log(pdaData);
        //         self.update(signer,dataAccountKP,{"hello":"good day"}).then(async (trans)=>{
                    
        //         });
        //     });
        // });
    })
});

