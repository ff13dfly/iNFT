import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

let link = null;
const self = {
    init: (network, ck) => {
        if (link !== null) return ck && ck(link);
        switch (network) {
            case Network.DEVNET:
                const aptosConfig = new AptosConfig({ network: Network.DEVNET });
                link = new Aptos(aptosConfig);
                break;

            default:

                break;
        }
        return ck && ck(link);
    },
    generate: (ck, cfg) => {
        return ck && ck(cfg === undefined ? Account.generate() : Account.generate(cfg));
    },
    recover: (base58, ck) => {
        const privateKeyBytes = [];
        const privateKey = new Ed25519PrivateKey(base58);
        const account = Account.fromPrivateKey({ privateKey });
        return ck && ck(account);
    },
    keyless: (ck) => {

    },
    wallet: (ck) => {

    },
    storage: (data, ck, network) => {
        self.init(network, async (aptos) => {
            // build a transaction
            // const transaction = await aptos.transaction.build.simple({
            //     sender: alice.accountAddress,
            //     data: {
            //     function: "0x1::coin::transfer",
            //     typeArguments: ["0x1::aptos_coin::AptosCoin"],
            //     functionArguments: [bobAddress, 100],
            //     },
            // });

            // // using sign and submit separately
            // const senderAuthenticator = aptos.transaction.sign({
            //     signer: alice,
            //     transaction,
            // });
            // const committedTransaction = await aptos.transaction.submit.simple({
            //     transaction,
            //     senderAuthenticator,
            // });

            // // using signAndSubmit combined
            // const committedTransaction = await aptos.signAndSubmitTransaction({
            //     signer: alice,
            //     transaction,
            // });
        });
    },
    run: (program_id, param, ck, network) => {

    },
    //get airdrop when create a new account
    airdrop: (u8Address, amount, ck, network) => {
        self.init(network, (aptos) => {
            aptos.fundAccount({
                accountAddress: u8Address,
                amount: amount,
            }).then((transaction) => {
                console.log(transaction);
                return ck && ck(true);
            }).catch((error) => {
                return ck && ck(error);
            });
        });
    },
    view: (value, type, ck, network) => {
        self.init(network, (aptos) => {
            const param = { accountAddress:value};
            switch (type) {
                case 'account':
                    aptos.getAccountInfo(param).then((obj) => {
                        return ck && ck(obj);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;

                case 'transaction':
                    aptos.getAccountTransactions(param).then((obj) => {
                        return ck && ck(obj);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;
                case 'token':
                    aptos.getAccountOwnedTokens(param).then((obj) => {
                        return ck && ck(obj);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;
                case 'block':
                    aptos.getBlockByHeight({blockHeight:value}).then((obj)=>{
                        return ck && ck(obj);
                    }).catch((error)=>{
                        return ck && ck(error);
                    });
                    break;
                case 'height':
                    aptos.getName({chain_name:network}).then((obj)=>{
                        return ck && ck(obj);
                    }).catch((error)=>{
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