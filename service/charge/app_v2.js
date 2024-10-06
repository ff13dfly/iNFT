//express framework
const express = require("express");
const bodyParser = require("body-parser");

//library
const IO = require("./lib/file.js");

//system
const SYSTEM={
    account:require("./system/account.js"),
    recover:require("./system/recover.js"),
    token:require("./system/token.js"),
    transaction:require("./system/transaction.js"),
}
//networks
const AnchorJS = require("./network/anchor.js");
//const Ether = require("./network/ethereum.js");

const args = process.argv.slice(2);
const config_file = !args[0] ? "config.json" : args[0];
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
};

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

self.init((cfg) => {
    const { output } = require("./lib/output.js");
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

            //1.confirm duplicate request, local record
            const hash = req.params.hash;       //payment hash
            SYSTEM.transaction.exsist(hash,(here)=>{
                if(here.error) return res.send(here);     //if exsist, return the error;

                //2.get the amount by payin transaction hash
                SYSTEM.token.check(hash, (basic) => {
                    if(basic.error) return res.send(basic);

                    SYSTEM.account.exsist(basic.account,(binded)=>{
                        if(binded.error) return res.send(binded);

                        //console.log(binded);
                        const target=binded.address;
                        const amount=basic.amount;
                        const more={rate:20};
                        SYSTEM.transaction.run(target,amount,(done)=>{
                            if(done.eror) return res.send(done);
                            res.send(done);
                        },more);
                    });
                });
            });
        });
    });
});