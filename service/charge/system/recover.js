const { REDIS } = require("../lib/redis.js");

let config=null;
const self = {
    set:(setting)=>{
        config=setting;
    },
    run:(ck)=>{

    },
};

module.exports = self;