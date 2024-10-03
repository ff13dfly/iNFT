const { REDIS } = require("../lib/redis.js");

let config=null;
const Recover = {
    set:(setting)=>{
        config=setting;
    },
    run:(ck)=>{

    },
};

module.exports = Recover;