import bs58 from 'bs58';
const SOL = window.solanaWeb3;

let link = null;
const default_local_uri = "http://127.0.0.1:8899";

const funs = {
    toBuffer: (str) => {
        return Uint8Array.from(Array.from(str).map(letter => letter.charCodeAt(0)));
    },

    //TODO, heret to check the input type
    check:(value,type)=>{
        switch (type) {
            case 'account':
                
                break;
        
            default:
                break;
        }

        //mock true result
        return true;
    },
}

const self = {
    // not sure this can work
    ss58ToHex:(ss58Address)=>{
        const decodedAddress = bs58.decode(ss58Address).slice(1, -4);
        console.log(decodedAddress);
        //console.log(JSON.stringify(decodedAddress) );
        const hexAddress = decodedAddress.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
        return '0x' + hexAddress;
    },

    // not work
    accountToHex:(ss58)=>{
        const {
            PublicKey,
        } = SOL;
        const pub = new PublicKey(ss58);
        //console.log(pub);
        //console.log(pub.toString(),pub.toJSON());
    },
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

    storage: (data, ck, signer, network) => {
        console.log(JSON.stringify(funs.toBuffer("你好")));
        //console.log(signer,network);
        self.init(network, (connection) => {
            const {
                Transaction,
                TransactionInstruction,
                SystemProgram,
                Keypair,
                PublicKey,
                LAMPORTS_PER_SOL,
            } = SOL;

            const storageAccount = Keypair.generate();

            const fromPublicKey = signer.publicKey;
            const accountPublicKey = storageAccount.publicKey;
            const dt = funs.toBuffer(JSON.stringify(data));

            //系统的ID，必须要的部分
            const program_id = new PublicKey('11111111111111111111111111111111');

            //1.创建账号的交易指令，再转2个SOL进去
            const createAccountInstruction = SystemProgram.createAccount({
                fromPubkey: fromPublicKey,
                newAccountPubkey: accountPublicKey,
                lamports: 3 * LAMPORTS_PER_SOL, // Amount of lamports to allocate (1 SOL)
                space: dt.length, // Amount of space to allocate
                programId: program_id,
            });

            //2.写入数据的交易指令
            const writeDataInstruction = new TransactionInstruction({
                keys: [
                    { pubkey: fromPublicKey, isSigner: true, isWritable: true },
                    { pubkey: accountPublicKey, isSigner: false, isWritable: true },
                ],
                programId: program_id,
                data: dt,
            });

            //const trans = new Transaction().add(createAccountInstruction, writeDataInstruction);
            connection.getRecentBlockhash().then(({ blockhash }) => {
                const param = {
                    recentBlockhash: blockhash,
                    feePayer: signer.publicKey,
                }
                const trans = new Transaction(param).add(createAccountInstruction, writeDataInstruction);
                //console.log(trans);
                if (typeof window.solana !== 'undefined') {
                    const wallet = window.solana;
                    wallet.connect().then(async (pair) => {
                        const signedTransaction = await wallet.signTransaction(trans);
                        console.log(signedTransaction);
                        //const signedTransaction= await wallet.signAllTransactions(trans);
                        //signAllTransactions
                        //const signature=connection.sendRawTransaction(signedTransaction.serialize())
                        //console.log(signature);
                        // wallet.signAndSendTransaction(trans).then(({signature}) => {

                        // }).catch(error => {
                        //     console.error('Failed signAndSendTransaction: ', error);
                        // });
                        //2.之前的版本
                        //wallet.signTransaction(trans)
                        // wallet.signTransaction(trans).then((signedTransaction) => {
                        //     //console.log(signedTransaction.serialize());
                        //     connection.sendRawTransaction(signedTransaction.serialize()).then((signature) => {
                        //         console.log('Transaction signature:', signature);
                        //         connection.confirmTransaction(signature).then(()=>{
                        //             console.log('Account Public Key:', accountPublicKey.toBase58());
                        //         });
                        //     }).catch(error => {
                        //         console.error('Failed to send raw transaction: ', error);
                        //     });
                        // }).catch(error => {
                        //     console.error('Failed to sign transaction: ', error);
                        // });
                    }).catch((error) => {
                        console.error('Failed to connect to Phantom:', error);
                    });
                }
            });
        });
    },
    run: (program_id, param, ck, network) => {
        self.init(network, (connection) => {
            const {
                Transaction,
                TransactionInstruction,
                PublicKey,
            } = SOL;

            connection.getRecentBlockhash().then(({ blockhash }) => {
                if (typeof window.solana !== 'undefined') {
                    const wallet = window.solana;
                    wallet.connect().then(async (signer) => {
                        const accountPublicKey = signer.publicKey;
                        const cfg = {
                            recentBlockhash: blockhash,
                            feePayer: accountPublicKey,
                        }

                        const dt = funs.toBuffer(JSON.stringify(param));
                        const programAccount = new PublicKey(program_id);
                        const ix = new TransactionInstruction({
                            keys: [
                                { pubkey: accountPublicKey, isSigner: false, isWritable: true },
                            ],
                            programId: programAccount,
                            data: dt,
                        });
                        const trans = new Transaction(cfg).add(ix);

                        wallet.signTransaction(trans).then((signedTransaction) => {
                            console.log(signedTransaction);
                            connection.sendRawTransaction(signedTransaction.serialize()).then((signature) => {
                                console.log('Transaction signature:', signature);
                                connection.confirmTransaction(signature).then(() => {
                                    console.log('Account Public Key:', accountPublicKey.toBase58());
                                });

                            }).catch(error => {
                                console.error('Failed to send raw transaction: ', error);
                            });

                        }).catch((error) => {
                            console.error('Failed to signed transaction:', error);
                        });

                    }).catch((error) => {
                        console.error('Failed to connect to Phantom:', error);
                    });
                }

            });
        });
    },

    airdrop: (target, amount, ck, network) => {
        self.init(network, async (connection) => {
            //console.log(connection);
            const {
                LAMPORTS_PER_SOL,
            } = SOL;

            let airdropSignature = await connection.requestAirdrop(
                target,
                amount * LAMPORTS_PER_SOL,
            );

            //console.log(airdropSignature);
            connection.confirmTransaction({ signature: airdropSignature }).then((res) => {
                return ck && ck(res);
            }).catch((error) => {
                return ck && ck(error);
            });
        });
    },
    view:(value,type,ck,network)=>{
        self.init(network,(connection)=>{
            //console.log(connection);
            const {
                PublicKey,
            } = SOL;
            switch (type) {
                case 'block':
                    const cfg={"maxSupportedTransactionVersion": 0};
                    connection.getBlock(value,cfg).then((res)=>{
                        return ck && ck(res);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;

                case 'account':
                    connection.getAccountInfo(value).then((info)=>{
                        return ck && ck(info);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;
                
                case 'transaction':
                    connection.getTransaction(value).then((info)=>{
                        return ck && ck(info);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;

                case 'program':
                    const program_id = new PublicKey(value);
                    connection.getProgramAccounts(program_id).then((info)=>{
                        return ck && ck(info);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;

                
                default:
                    break;
            }
        });
    },
};

export default self;