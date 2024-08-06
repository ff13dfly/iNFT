const {DataProgram}=require("solana-data-program");
const SOL = require("@solana/web3.js");
const bs58 = require("bs58");

let link = null;
const self={
    init: (network, ck) => {
        if (link !== null) return ck && ck(link);
        const { Connection, clusterApiUrl } = SOL;
        switch (network) {
            case "devnet":
                link = new Connection(clusterApiUrl("devnet"));
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
    
}

//key value from Phantom wallet
const test_privateKey="Mp6UoMT9vUeLudtehxyLPNupJrFeMs6QWGtPwXKGR7Lsj5vK3YUbxMKJkyRr6okkGDZzYJRMoX1HmBspJ97YVr7"

self.init("devnet",async (connection)=>{
    const signer=self.recover(test_privateKey);
    console.log(`Signer account public key: ${signer.publicKey.toString()}`)
    console.log(`Signer account secret key: ${bs58.encode(signer.secretKey)}`);


    //const app_id = "83EAcYs5J9PoGUvkxyiB4axaMPRCUa6paBmov2A2L4Pm";
    const app_id="E4PzkEaDhtToPvtHUh4Lp5KAR8wzcmscFm9ARiv6fD5D";
    const programId = new SOL.PublicKey(app_id);

    //const owner = "EmEY2LbCJT5Povwo96bP88A1e6mAaADKhZ4P1xY7zHWJ";
    const owner ="Ffkw37RbBWAYmEHSKXSzQRrVKBXXt9XLWShcB1zewVtG"
    const programOwnerPublicKey = new SOL.PublicKey(owner);

    //const data_id = "Fw23tEb632ytFPA8XPYhKRYi2584tphexcMpsLw4hc6y";
    const data_id ="EmEY2LbCJT5Povwo96bP88A1e6mAaADKhZ4P1xY7zHWJ";
    const dataPublicKey = new SOL.PublicKey(data_id);

    //const root_id = "BPFLoaderUpgradeab1e11111111111111111111111";
    const root_id = "11111111111111111111111111111111";
    const rootPublicKey = new SOL.PublicKey(root_id);


    const keys = [
        { pubkey: signer.publicKey, isSigner: true, isWritable: true },
        { pubkey: programId, isSigner: false, isWritable: true },
        { pubkey: dataPublicKey, isSigner: false, isWritable: true },
        { pubkey: programOwnerPublicKey, isSigner: false, isWritable: false },
        { pubkey: rootPublicKey, isSigner: false, isWritable: false },
    ];

    const transaction = new SOL.Transaction();
    transaction.add(
        new SOL.TransactionInstruction({
            keys: keys,
            programId: app_id,
            //data:Buffer.from(""),
        })
    );
    const txid = await SOL.sendAndConfirmTransaction(connection, transaction, [signer]);
    console.log(txid);
});

