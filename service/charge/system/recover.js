/* check the charge record from record anchor
 *  auth: Fuu
 *  date: 2024-10-3
 */

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