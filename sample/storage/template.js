const SOL = require("@solana/web3.js");
const bs58 = require('bs58');
let link = null;
const self = {
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
        return ck && ck(link);
    },
    recover: (base58String) => {
        const privateKey = bs58.decode(base58String)
        const arr = Buffer.from(privateKey);
        return SOL.Keypair.fromSecretKey(arr);
    },
}
console.log(`-------------------------start-------------------------------`);
const test_privateKey = "Mp6UoMT9vUeLudtehxyLPNupJrFeMs6QWGtPwXKGR7Lsj5vK3YUbxMKJkyRr6okkGDZzYJRMoX1HmBspJ97YVr7"
const signer = self.recover(test_privateKey);
console.log(`Signer account public key: ${signer.publicKey.toString()}`)
console.log(`Signer account secret key: ${bs58.encode(signer.secretKey)}`);
console.log(`-------------------------------------------------------------`);

self.init("devnet", async (connection) => {
    const newAccount = SOL.Keypair.generate();
    console.log(`New account public key: ${newAccount.publicKey.toString()}`)
    console.log(`New account secret key: ${bs58.encode(newAccount.secretKey)}`);
    console.log(`-------------------------------------------------------------`);

    const root_id = "BPFLoaderUpgradeab1e11111111111111111111111";
    const program=new SOL.PublicKey(root_id);
    const jsonData = '{"hello":"great world"}';
    const dataBuffer = Buffer.from(jsonData, 'utf-8');
    const ix = SOL.SystemProgram.createAccount({
        fromPubkey: signer.publicKey,
        newAccountPubkey: newAccount.publicKey,
        lamports: 18800000,
        space: dataBuffer.length,
        source: signer.publicKey,
        programId:program,
        data: dataBuffer,
    });

    const transaction = new SOL.Transaction();
    transaction.add(ix);
    const txid = await SOL.sendAndConfirmTransaction(connection, transaction, [signer, newAccount]);
    console.log("Create account successful! Hash: " + txid);
    console.log(`-------------------------------------------------------------`);
    
    console.log("Saveing data ...");
    const saving = new SOL.Transaction().add(
        SOL.SystemProgram.transfer({
            fromPubkey: signer.publicKey,
            toPubkey: signer.publicKey, // Writing to the same account
            lamports: 0, // No lamports transferred
            data: dataBuffer,
        })
    );
    const txnid = await SOL.sendAndConfirmTransaction(connection, saving, [signer]);
    console.log("Saving data successful! Hash: " + txid);
    console.log(`---------------------------end-------------------------------`);
});