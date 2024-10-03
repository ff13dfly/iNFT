
const tools = require("../lib/tools.js");
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
const Account = {
    set:(setting)=>{
        config=setting;
    },
    exsist:(addr,ck)=>{

    },
    bind:(name,block,ck)=>{
        AnchorJS.view({ name: name, block: block }, "anchor", (ak) => {
            if (ak === false) return ck && ck({ error: "No target anchor to confirm account relationship" });
            const json = ak.raw;
            if (!json.salt) return ck && ck({ error: "Invalid account confirmation" });
            const key = `${config.keys.prefix_salt}${json.salt}`;
            REDIS.getKey(key, (record) => {
                console.log(record);
            });

            const local = {
                anchor: `anchor://${name}/${block}`,
                address: ak.owner,
                network: json.network,
            }

            const akey = `${config.keys.prefix_record}${json.account}`;
            REDIS.setKey(akey, JSON.stringify(local), (done) => {
                if (!done) return ck&&ck({ error: "Internal error, redis crush down." });
                return ck && ck({ success: true });
            });
        });

    },
    salt:(ck)=>{
        const salt = tools.char(16);
        const key = `${config.keys.prefix_salt}${salt}`;
        const expired = 30 * 60;            //30 mins expire
        const record = {
            stamp: tools.stamp(),
            status: status.salt.PENDING,
        }

        //2.save the cache record
        console.log(record, key);
        REDIS.setKey(key, JSON.stringify(record), (done) => {
            if (!done) return ck && ck({ error: "Internal error, redis crush down." });
            ck && ck({ salt: salt, expire: expired });
        }, expired);
    },
};

module.exports = Account;