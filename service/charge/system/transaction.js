
const { REDIS } = require("../lib/redis.js");

const AnchorJS = require("../network/anchor.js");

let config=null;
const Transaction = {
    set:(setting)=>{
        config=setting;
    },
    exsist:(hash,ck)=>{
        if (hash.length !== 66) return ck && ck({ error: "Invalid transaction hash." });
        const prefix = config.keys.prefix_record;
        const key = `${prefix}${hash}`;
        REDIS.exsistKey(key, (here) => {
            if (here) return ck && ck({ error: "Dumplicate request." });
            return ck && ck(false);
        });
    },
    run:(pair,target,amount,ck)=>{

    },
};

module.exports = Transaction;