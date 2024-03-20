const SOL = window.solanaWeb3;

let link = null;
const default_local_uri = "http://127.0.0.1:8899";

const funs = {
    toBuffer: (str) => {
        return Uint8Array.from(Array.from(str).map(letter => letter.charCodeAt(0)));
    },
}

const self = {
    //create connection to Solana node
    init: (network, ck) => {
        if (link !== null) return ck && ck(link);
        const { Connection, clusterApiUrl } = SOL;
        switch (network) {
            case "devnet":
                link = new Connection(clusterApiUrl('devnet'));
                break;

            default:
                link = new Connection(default_local_uri, "confirmed");
                break;
        }
        return ck && ck(link);
    },

    //connect to Phantom wallet
    wallet: (ck) => {
        if (typeof window.solana !== 'undefined') {
            try {
                window.solana.connect().then((res) => {
                    return ck && ck(res);
                });

            } catch (error) {
                return ck && ck(error);
            }
        } else {
            return ck && ck({ error: "No Phantom wallet found." });
        }
    },

    //storage data on chain
    storage: (data, ck, signer, network) => {
        self.init(network, (connection) => {
            const {
                Transaction,
                TransactionInstruction,
                SystemProgram,
                Keypair,
                PublicKey,
                sendAndConfirmTransaction
            } = SOL;

            const PROGRAM_ID = new PublicKey(
                "BCw7MQWBugruuYgno5crGUGFNufqGJbPpzZevhRRRQAu"
            );
            const storageAccount = Keypair.generate();
            const dt = funs.toBuffer(JSON.stringify(data));
            //console.log(dt);

            console.log(`Payer Address      : ${signer.publicKey}`);
            console.log(`Address Info Acct  : ${storageAccount.publicKey}`);

            let ix = new TransactionInstruction({
                keys: [
                    { pubkey: signer.publicKey, isSigner: true, isWritable: true },
                    { pubkey: storageAccount.publicKey, isSigner: true, isWritable: true },
                    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
                ],
                programId: PROGRAM_ID,
                data: dt,
            });
            
            connection.getRecentBlockhash().then(({ blockhash }) => {
                const param={
                    recentBlockhash: blockhash,
                    feePayer: signer.publicKey,
                }
                const trans = new Transaction(param).add(ix);
                if (typeof window.solana !== 'undefined') {
                    const wallet = window.solana;
                    //connection.getRecentBlockhash().then(({ blockhash }) => {
                    wallet.connect().then((pair) => {

                        //const param = { recentBlockhash: blockhash };
                        //console.log(wallet.signTransaction);
                        wallet.signTransaction(trans).then((signedTransaction) => {
                            connection.sendRawTransaction(signedTransaction.serialize()).then((signature) => {
                                console.log('Transaction signature:', signature);
                            })
                        });
                    }).catch(error => {
                        console.error('Failed to connect to Phantom:', error);
                    });
                    //});

                }
            });

            // 使用solanaWeb3进行交易
            // sendAndConfirmTransaction(
            //     connection, 
            //     trans,
            //     [signer, storageAccount]
            // ).then((res)=>{
            //     return ck && ck(res);
            // });
        });
    },
    run: (target, ck) => {

    },

    airdrop: (target, ck) => {

    },
};

module.exports = self;