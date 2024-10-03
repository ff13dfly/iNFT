/* Charge the target Anchor Network account, record the charge on chain
 *  auth: Fuu
 *  date: 2024-10-3
 */

const { REDIS } = require("../lib/redis.js");
const AnchorJS = require("../network/anchor.js");

const status = {
    payment: {
        ANK_PAYMENT_DONE: 1,             //$ANK payed
        WAITING_FOR_PAYMENT: 2,          //
        CHECK_FAILED: 44,
    },
    salt: {
        PENDING: 6,
        CHECKED: 1,
    },
};


let config=null;
const self = {
    set:(setting)=>{
        config=setting;
    },
    sender:()=>{

    },

    record:(hash,amount,rate,ck)=>{
        const prefix = config.keys.prefix_record;
        const record = {
            usdt: amount,
            rate: rate,
            coin: 0,
            hash: hash,
            status: status.payment.WAITING_FOR_PAYMENT,
        }
        const key=``;
        REDIS.setKey(key, JSON.stringify(record), (tag) => {
            if (!tag) return res.send({ error: "Internal error, failed to tag." });
            return ck && ck(true);
        });
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
        //1.get the senter account and pair
        //2.do transfer
        //3.record the transaction on local redis
        //4.record the charge on chain.
    },
};

module.exports = self;