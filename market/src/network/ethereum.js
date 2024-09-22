/* 
*  ERC20 operation lib
*  @auth [ Fuu ]
*  @creator Fuu
*  @date 2024-09-22
*  @functions
*  1. All functions
*/

import {Web3} from "web3";
import abi from "erc-20-abi";

const config = {
    node: "https://holesky.infura.io/v3/799349fbc6ff411983d3d1feba0a3bc7",  //Tanssi appchain URI
    target: 12000,           //How long to create a new block
    apikey:"799349fbc6ff411983d3d1feba0a3bc7",          //infura.io app key.
    erc20:"0x9105c2ff36d2455d15273024dd0b002c8d2781f6",
}

const funs={

}

const self={
    init:(ck)=>{
        const W3 = new Web3(config.node);
        const contract = new W3.eth.Contract(abi, config.erc20);
        console.log(contract.methods);
        contract.methods.symbol().call().then(console.log);

        const userAddress="0xD4C8251C06C5776Fa2B488c6bCbE1Bf819D92d83";
        contract.methods.balanceOf(userAddress).call().then(console.log);
        //const contract = new W3.eth.Contract(erc20Abi, erc20Address);

        const toAddress="0x9105C2FF36d2455d15273024dD0B002C8d2781F6";
        const amount=188000000000000000000n;
        const fromAddress="0xD4C8251C06C5776Fa2B488c6bCbE1Bf819D92d83";

        contract.methods.transfer(toAddress, amount).send({ from: fromAddress }).on('receipt', console.log);
        return ck && ck();
    },
    check:(erc20,ck)=>{
        self.init(()=>{

        });
    },
}

export default self;