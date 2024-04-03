import * as SOL from "@solana/web3.js";

let checker = null;
let link = null;
const config = {
    interval: 400,
    defaultNode: "http://127.0.0.1:8899",
}

const funs = {
    toBuffer: (str) => {
        return Uint8Array.from(Array.from(str).map(letter => letter.charCodeAt(0)));
    },

    //TODO, heret to check the input type
    check: (value, type) => {
        switch (type) {
            case 'account':

                break;

            default:
                break;
        }

        //mock true result
        return true;
    },
    uint8ArrayToBase58: (uint8Array) => {
        const BASE58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        let base58String = '';
        let value = 0n;
        let base = 1n;

        // Convert Uint8Array to BigInt
        for (let i = uint8Array.length - 1; i >= 0; i--) {
            value += window.BigInt(uint8Array[i]) * base;
            base *= 256n;
        }

        // Convert BigInt to Base58 string
        while (value > 0n) {
            const remainder = value % 58n;
            value = value / 58n;
            base58String = BASE58_CHARS[Number(remainder)] + base58String;
        }

        // Prefix leading zero bytes in Uint8Array with '1' in Base58 string
        for (let i = 0; i < uint8Array.length && uint8Array[i] === 0; i++) {
            base58String = '1' + base58String;
        }

        return base58String;
    }
}

const self = {
    ss58ToHex: (base58String) => {
        const bs58 = require('bs58');
        const uint8Array = bs58.decode(base58String);

        // Convert the Uint8Array to a hexadecimal string
        const hexString = Array.from(uint8Array)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');

        return "0x" + hexString;
    },

    accountToHex: (ss58) => {
        const {
            PublicKey,
        } = SOL;
        const pub = new PublicKey(ss58);
        const u8arr = pub.toBytes();
        return '0x' + Array.from(u8arr)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
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
                link = new Connection(config.defaultNode, "confirmed");
                break;
        }

        console.log(link);
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
    balance: (pub, ck) => {     //get balance from base58 account

    },

    //TODO,support generating account from seed;
    generate: (ck, seed) => {
        const {
            Keypair,
        } = SOL;
        const acc = Keypair.generate();
        return ck && ck(acc);
    },
    transfer: (amount, to, ck, network) => {
        const {
            Transaction,
            SystemProgram,
            sendAndConfirmTransaction,
            PublicKey,
            LAMPORTS_PER_SOL
        } = SOL;
        self.init(network, (connection) => {
            connection.getRecentBlockhash().then(({ blockhash }) => {
                if (typeof window.solana !== 'undefined') {
                    const wallet = window.solana;
                    wallet.connect().then(async (from) => {
                        const toAccount = new PublicKey(to);
                        const transaction = new Transaction().add(
                            SystemProgram.transfer({
                                fromPubkey: from.publicKey,
                                toPubkey: toAccount,
                                lamports: amount * LAMPORTS_PER_SOL,
                            }),
                        );

                        const signature = await sendAndConfirmTransaction(
                            connection,
                            transaction,
                            [from],
                        );
                        return ck && ck(signature);
                    });
                }
            });
        });
    },
    run: (program_id, owner, param, ck, network) => {
        self.init(network, async (connection) => {
            const {
                Account,
                PublicKey,
                Transaction,
                TransactionInstruction,
                sendAndConfirmTransaction,
            } = SOL;
            //console.log(new TransactionInstruction());
            connection.getRecentBlockhash().then(({ blockhash }) => {
                if (typeof window.solana !== 'undefined') {
                    const wallet = window.solana;
                    wallet.connect().then(async (signerAccount) => {
                        const acc=new Account();
                        console.log(signerAccount);
                        console.log(wallet.signer);
                        console.log(acc);
                        
                        // const accountPublicKey = signerAccount.publicKey;

                        const programId = new PublicKey(program_id);
                        // Public key of the account owner
                        const ownerPublicKey = new PublicKey(owner);

                        // Parameters to pass to the program
                        const stringParam = "Hello, Solana!";
                        const intParam = 123;
                        const stringParamBytes = new TextEncoder().encode(stringParam);
                        const instructionData = new Uint8Array([
                            0, // Function selector
                            ...stringParamBytes, // String parameter as bytes
                            intParam >> 24 & 0xff, // Integer parameter bytes
                            intParam >> 16 & 0xff,
                            intParam >> 8 & 0xff,
                            intParam & 0xff,
                        ]);

                        const instruction = new TransactionInstruction({
                            keys: [
                                { pubkey: ownerPublicKey, isSigner: true, isWritable: false },
                            ],
                            programId,
                            data: instructionData,
                        });

                        const transaction = new Transaction();
                        transaction.feePayer=signerAccount.publicKey;
                        transaction.recentBlockhash=blockhash;
                        transaction.add(instruction);

                        const trans =  await wallet.signTransaction(transaction);
                        //const signature = await sendAndConfirmTransaction(connection, trans,[]);
                        const signature = await sendAndConfirmTransaction(connection,trans,[wallet.signer])
                        return ck && ck(signature);
                    })
                    // .catch((err)=>{
                    //     console.log(err);
                    // });
                }
            });
        });

    },
    run_back: (program_id, param, ck, network) => {
        self.init(network, (connection) => {
            const {
                Transaction,
                TransactionInstruction,
                PublicKey,
                SystemProgram
            } = SOL;

            //return console.log(SystemProgram);

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
                        console.log(programAccount);
                        const ix = new TransactionInstruction({
                            keys: [
                                { pubkey: accountPublicKey, isSigner: false, isWritable: true },
                                { pubkey: programAccount, isSigner: false, isWritable: false },     //prog
                            ],
                            programId: programAccount,
                            data: dt,
                        });
                        const trans = new Transaction(cfg).add(ix);

                        //return console.log(trans);

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

            connection.confirmTransaction({ signature: airdropSignature }).then((res) => {
                return ck && ck(res);
            }).catch((error) => {
                return ck && ck(error);
            });
        });
    },
    view: (value, type, ck, network) => {
        self.init(network, (connection) => {
            const {
                PublicKey,
            } = SOL;
            switch (type) {
                case 'block':
                    const cfg = { "maxSupportedTransactionVersion": 0 };
                    connection.getBlock(value, cfg).then((res) => {
                        return ck && ck(res);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;

                case 'account':
                    const publicKey = new PublicKey(value);
                    connection.getAccountInfo(publicKey).then((info) => {
                        return ck && ck(info);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;

                case 'transaction':
                    connection.getTransaction(value).then((info) => {
                        return ck && ck(info);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;

                case 'program':
                    const program_id = new PublicKey(value);
                    connection.getProgramAccounts(program_id).then((info) => {
                        return ck && ck(info);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;

                case 'balance':
                    connection.getBalance(value).then((info) => {
                        return ck && ck(info);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;

                case 'token':

                    break;

                default:
                    break;
            }
        });
    },
    subscribe: (network, ck) => {
        self.init(network, (connection) => {
            if (checker === null) {
                checker = setInterval(() => {
                    connection.getSlot().then((block) => {
                        //console.log('New block received:', block);
                        self.view(block, "block", (block) => {
                            //console.log(block.blockhash);
                            return ck && ck(self.ss58ToHex(block.blockhash));
                        }, network);
                    })
                }, config.interval);
            }
        });
    },
};

export default self;