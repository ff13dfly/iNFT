/* check the token on Ethereum Network
 *  auth: Fuu
 *  date: 2024-10-3
 */

const Ether = require("../network/ethereum.js");

let config=null;
const self = {
    set:(setting)=>{
        config=setting;
    },
    check:(hash,ck)=>{
        Ether.view(hash,(data)=>{
            //return format :{from:"",to:"",amount:""}
            return ck && ck(data);
        });
    },
};

module.exports = self;