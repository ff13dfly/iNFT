const Ether = require("../network/ethereum.js");

let config=null;
const self = {
    set:(setting)=>{
        config=setting;
    },
    check:(hash,ck)=>{
        const result={  
            amount:19.9,                                                //transaction amount
            account:"0xD4C8251C06C5776Fa2B488c6bCbE1Bf819D92d83",       //signer account
            stamp:0,                                                    //transaction timestamp
        };

        return ck && ck(result);
    },
    exsist:(hash,ck)=>{

    },
};

module.exports = self;