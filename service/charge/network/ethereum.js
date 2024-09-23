/* 
*  ERC20 operation lib
*  @auth [ Fuu ]
*  @creator Fuu
*  @date 2024-09-22
*  @functions
*  1. All functions
*/

//https://support.infura.io/building-with-infura/javascript-typescript/how-to-send-erc20-tokens-web3js
//https://docs.infura.io/tutorials/ethereum/send-a-transaction/use-web3.js

// $INFT 3.1415926 transaction hash
//0x093fe698eb6d3c35b66dbf46f81824fa0daf4f0db3a72e1881136a28274c86ac

import {Web3} from "web3";
import abi from "erc-20-abi";
import tools from "./tools";

const config = {
    node: "https://holesky.infura.io/v3/799349fbc6ff411983d3d1feba0a3bc7",  //Tanssi appchain URI
    target: 12000,           //How long to create a new block
    apikey:"799349fbc6ff411983d3d1feba0a3bc7",          //infura.io app key.
    erc20:{
        address:"0x9105c2ff36d2455d15273024dd0b002c8d2781f6",
        creator:"0xD4C8251C06C5776Fa2B488c6bCbE1Bf819D92d83",
        name:"INFT",
        contract:"InftToken",
    }
}

const funs={

}

// const toAddress="0x9105C2FF36d2455d15273024dD0B002C8d2781F6";
// const amount=188;
// const fromAddress="0xD4C8251C06C5776Fa2B488c6bCbE1Bf819D92d83";
// const fromPrivateKey = "0x7d5273b849eb8658ed08eeddd4ec9adb269a9693c548096532674841c771b395";
// const contractAddress="0x9105c2ff36d2455d15273024dd0b002c8d2781f6";

let W3=null;
const self={
    init:(ck)=>{
        if(W3!==null) return ck && ck(W3);
        W3=new Web3(
            new Web3.providers.HttpProvider(config.node),
        );
        return ck && ck(W3);
    },
    balance:(addr,ck)=>{
        self.init(()=>{
            const contract = new W3.eth.Contract(abi, config.erc20.address);
            contract.methods.balanceOf(addr).call().then(ck);
        });
    },
    check:(erc20,ck)=>{
        self.init(()=>{

        });
    },
    view:(hash,ck)=>{
        //https://community.infura.io/t/web3-js-how-to-track-erc-20-token-transfers-specific-address-token/5571
        self.init(()=>{
            W3.eth.getTransactionReceipt(hash).then((data)=>{
                const dt=W3.eth.abi.decodeLog(
                    abi[9].inputs,                  //must index:9, it is the event format
                    data.logs[0].data,              
                    data.logs[0].topics
                );
                console.log(dt);
                return ck && ck(dt);
            });
        });
    },
    token:async ()=>{
        const web3 = new Web3(
            new Web3.providers.HttpProvider(config.node),
        );

        const tokenAddress = "0x9105c2ff36d2455d15273024dd0b002c8d2781f6";
        const toAddress = "0x9105C2FF36d2455d15273024dD0B002C8d2781F6";
        const fromPrivateKey = "0x7d5273b849eb8658ed08eeddd4ec9adb269a9693c548096532674841c771b395";
        const signer = web3.eth.accounts.privateKeyToAccount(fromPrivateKey);
        web3.eth.accounts.wallet.add(signer);

        const contract = new web3.eth.Contract(abi, tokenAddress, {
            from: signer.address,
        });

        contract.methods.balanceOf(signer.address).call().then(console.log);

        const amount = web3.utils.toHex(188000000000000000000n);
        const nonce = await web3.eth.getTransactionCount(signer.address);
        const tx = {
            from: signer.address,
            to: tokenAddress,
            value: "0x0",
            data: contract.methods.transfer(toAddress, amount).encodeABI(),
            nonce: nonce,  
            chainId: 17000,     //holesky chain ID
            type: 0x2,

            //type 2 transaction EIP-1559 transactions
            gas: web3.utils.toHex(50000000),
            maxFeePerGas:web3.utils.toHex(web3.utils.toWei("3", "gwei")),
            maxPriorityFeePerGas: web3.utils.toHex(35),
          };

          const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey);
            console.log("Raw transaction data: " + signedTx.rawTransaction);
          const receipt = await web3.eth
            .sendSignedTransaction(signedTx.rawTransaction)
            .once("transactionHash", (txhash) => {
            console.log(`Mining transaction ...`);
            console.log(`https://holesky.etherscan.io/tx/${txhash}`);
            });
        // The transaction is now on chain!
        console.log(`Mined in block ${receipt.blockNumber}`);
    },
    send:async (tokenHolder, walletSecret, toAddress, amount)=>{ 
        const W3 = new Web3(config.node);
        const nonce = await W3.eth.getTransactionCount(tokenHolder);
        const gasPrice = await W3.eth.getGasPrice();
        const gasLimit = 200000;

        //console.log(W3.utils.toHex(W3.utils.toWei(amount, 'ether')));
    
        const params = {
            from: tokenHolder,
            to: toAddress, 
            nonce: W3.utils.toHex(nonce),
            data: abi,
            value: W3.utils.toHex(W3.utils.toWei(amount, 'ether')),
            gasPrice: W3.utils.toHex(30000000),
            gasLimit: W3.utils.toHex(gasLimit),
            maxFeePerGas:W3.utils.toHex(1000000),
        };
     
        const signedTx = await W3.eth.accounts.signTransaction(params, walletSecret);
    
        try { 
            W3.eth.sendSignedTransaction(signedTx.rawTransaction)
            .on('transactionHash', function(hash){
                console.log("txHash", hash);
            })
            .on('receipt', function(receipt){
                console.log("receipt", receipt) 
            })
            .on('confirmation', function(confirmationNumber, receipt){ 
                console.log("confirmationNumber",confirmationNumber,"receipt",receipt) 
            })
            .on('error', console.error); 
        } catch(error) {
            console.log(error);
        } 
    }
}

export default self;