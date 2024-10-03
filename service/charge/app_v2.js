//express framework
const express = require("express");
const bodyParser = require("body-parser");

//library
const tools = require("./lib/tools.js");
const IO = require("./lib/file.js");
const { output } = require("./lib/output.js");

//system
const SYSTEM={
    account:require("./system/account.js"),
    recover:require("./system/recover.js"),
    token:require("./system/token.js"),
    transaction:require("./system/transaction.js"),
}


const { REDIS } = require("./lib/redis.js");

//networks
const AnchorJS = require("./network/anchor.js");
const Ether = require("./network/ethereum.js");

const args = process.argv.slice(2);
const config_file = !args[0] ? "config.json" : args[0];
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
const self = {
    init: (ck) => {
        IO.read(config_file, (data) => {
            if (data.error) return ck && ck({ error: "Failed to load config file." });
            try {
                const cfg = JSON.parse(data);
                self.autoset(cfg);
                AnchorJS.set(cfg.network.anchor[0]);

                return ck && ck(cfg);
            } catch (error) {
                return ck && ck({ error: "Failed to parse config file." });
            }
        });
    },
    autoset:(cfg)=>{
        for(let k in SYSTEM){
            if(SYSTEM[k].set)SYSTEM[k].set(cfg);
        }
    },
    getAccountToPay:(amount,accounts,ck,ignore)=>{

        console.log(accounts);
    },
    payANK: (addr,amount,accounts,ck) => {
        self.getAccountToPay(amount,(pair)=>{
            const result={
                hash:"TRANSACTION_HASH",
                index:0,
            }
            return ck && ck(result);
        });
    },
};

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let server = null;
self.init((cfg) => {
    if (cfg.error) return output(`Error to load config file: ${config_file}`, "error", true);

    const server = app.listen(cfg.server.port, function () {

        const host = server.address().address;
        const port = server.address().port;
        output(`\n******************************************************************************************`, "success", true);
        output(`** iNFT Charge System start at http://${host}:${port}                                           **`, "success", true);
        output(`** Author: Fuu, copyright 2024.                                                         **`, "success", true);
        output(`******************************************************************************************`, "success", true);

        const demo_hash = "0x093fe698eb6d3c35b66dbf46f81824fa0daf4f0db3a72e1881136a28274c86ac";
        const demo_anchor = "necwm_123";
        const demo_block = 46738;
        output(`Cors should be supported by Nginx.`);
        output(`Copy the following URL to explorer to test: `, "", true);
        output(`[Payment check] http://localhost:${cfg.server.port}/${demo_hash}`, "primary", true);
        output(`[Bind salt]  http://localhost:${cfg.server.port}/bind`, "primary", true);
        output(`[PoE check] http://localhost:${cfg.server.port}/check/${demo_anchor}/${demo_block}`, "primary", true);

        //Checking actions.
        //1.check the record anchor owner
        //2.check params to clean the local record and build from anchor record

        app.get("/", (req, res) => {
            res.send("");
        });

        //Get the bind salt for PoE
        app.get("/bind", (req, res) => {
            //1.get the salt to bind accounts
            SYSTEM.account.salt((result)=>{
                res.send(result);
            });
        });

        app.get("/check/:anchor/:block", (req, res) => {
            const anchor = req.params.anchor;     //PoE anchor name
            const block = req.params.block;       //PoE record blocknumber

            //1. confirm the PoE anchor
            //http://localhost:6677/check/my001/213724
            SYSTEM.account.bind(anchor,block,(result)=>{
                res.send(result);
            });
        });


        //1.PoE bind check, write from account on substrate account. 
        // the $ANK will be payed to the signer of the anchor. Not the owner of anchor. 
        //2.Check the payment hash, then sent the $ANK to target account

        //app.get("/:hash/:anchor/:block", (req, res) => {
        app.get("/:hash", (req, res) => {
            const hash = req.params.hash;       //payment hash
            SYSTEM.transaction.exsist(hash,(here)=>{
                if(here!==false) return res.send(here);     //if exsist, return the error;

                Token.check(hash, (basic) => {

                    //1.saving the hash and set the status 
                    const record = {
                        usdt: basic.amount,
                        rate: cfg.rate,
                        coin: 0,
                        hash: hash,
                        status: status.payment.WAITING_FOR_PAYMENT,
                    }
                    REDIS.setKey(key, JSON.stringify(record), (tag) => {
                        if (!tag) return res.send({ error: "Internal error, failed to tag." });
                        console.log(key);
                        //2.get the Substrate account by record

                        const akey = `${cfg.keys.prefix_record}${basic.account}`;
                        REDIS.getKey(akey, (local) => {
                            if (!local) return res.send({ error: "Failed to get related account." });
                            try {
                                const adata=JSON.parse(local);
                                //3.sent the $ANK coin;
                                self.payANK(adata.address,basic.amount,cfg.account,(trans)=>{

                                    //4.add record to "ANCHOR_RECORD" on chain
                                    const from={
                                        network:"",
                                        transaction:"",
                                    };
                                    const charge={
                                        network:"anchor",
                                        finalization:"",
                                        address:"",
                                        index:2,
                                    };
                                    self.recordOnChain(from,charge,(ready)=>{
                                        //5.update charge order status
                                        const recordN = tools.clone(record);
                                        recordN.status = status.payment.ANK_PAYMENT_DONE;

                                        //6.update the overview data
                                    });

                                    
                                });
                            } catch (error) {
                                return res.send({ error: "Failed to decode local account record." });
                            }

                            

                        });
                    });
                });
            });
        });
    });
});