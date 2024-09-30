//express framework
const express = require("express");
const bodyParser = require("body-parser");

//library
const tools = require("./lib/tools.js");
const IO = require("./lib/file.js");
const { output } = require("./lib/output.js");
const { REDIS } = require("./lib/redis.js");

//networks
const AnchorJS = require("./network/anchor.js");
const Ether=require("./network/ethereum.js");

const args = process.argv.slice(2);
const config_file=!args[0]?"config.json":args[0];
const status={
    payment:{
        ANK_PAYMENT_DONE:1,             //$ANK payed
        WAITING_FOR_PAYMENT:2,          //
        CHECK_FAILED:44,
    },
    salt:{
        PENDING:6,
        CHECKED:1,
    },
};
const self={
    init:(ck)=>{
        IO.read(config_file,(data)=>{
            if(data.error) return ck && ck({error:"Failed to load config file."});
            try {
                const config=JSON.parse(data);
                AnchorJS.set(config.network.anchor[0]);
                return ck && ck(config);
            } catch (error) {
                return ck && ck({error:"Failed to parse config file."});
            }
        });
    },
    checkHashToGetAmount:(hash,ck)=>{

        return ck && ck(19.99);
    },
    payANK:(addr,ck)=>{

    },
};

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let server=null;
self.init((cfg)=>{
    if(cfg.error) return output(`Error to load config file: ${config_file}`,"error",true);

    const server=app.listen(cfg.server.port, function () {

        const host = server.address().address;
        const port = server.address().port;
        output(`\n******************************************************************************************`, "success", true);
        output(`** iNFT Charge System start at http://${host}:${port}                                           **`, "success", true);
        output(`** Author: Fuu, copyright 2024.                                                         **`, "success", true);
        output(`******************************************************************************************`, "success", true);

        const demo_hash="0x093fe698eb6d3c35b66dbf46f81824fa0daf4f0db3a72e1881136a28274c86ac";
        const demo_anchor="necwm_123";
        const demo_block=46738;
        output(`Cors should be supported by Nginx.`);
        output(`Copy the following URL to explorer to test: `,"", true);
        output(`[Payment check] http://localhost:${cfg.server.port}/${demo_hash}`,"primary", true);
        output(`[Bind salt]  http://localhost:${cfg.server.port}/bind`,"primary", true);
        output(`[PoE check] http://localhost:${cfg.server.port}/check/${demo_anchor}/${demo_block}`,"primary", true);
        
        app.get("/", (req, res) => {
            res.send("");
        });

        //Get the bind salt for PoE
        app.get("/bind", (req, res) => {
            //1.get the salt
            const salt=tools.char(16);
            const key=`${cfg.keys.prefix_salt}${salt}`;
            const expired=30*60;            //30 mins expire
            const record={
                stamp:tools.stamp(),
                status:status.salt.PENDING,
            }

            //2.save the cache record
            console.log(record,key);
            REDIS.setKey(key,JSON.stringify(record),(done)=>{
                if(!done) return res.send({error:"Internal error, redis crush down."});
                res.send({salt:salt,expire:expired});
            },expired);
        });

        app.get("/check/:anchor/:block", (req, res) => {
            const anchor=req.params.anchor;     //PoE anchor name
            const block=req.params.block;       //PoE record blocknumber

            //1. confirm the PoE anchor
            AnchorJS.view({name:anchor,block:block},"anchor",(ak)=>{
                if(ak===false) return res.send({error:"No target anchor to confirm account relationship"});
                try {
                    const json=JSON.parse(ak.data);
                    //2.check the network and account
                    if(!json.salt) return res.send({error:"Invalid account confirmation"});
                    console.log(json);

                    const key=`${cfg.keys.prefix_salt}${json.salt}`;
                    REDIS.getKey(key,(record)=>{
                        console.log(record);
                    },expired);

                    const local={
                        anchor:`anchor://${anchor}/${block}`,
                        address:json.address,
                        network:json.network,
                    }

                    const akey=`${cfg.keys.prefix_record}${ak.owner}`;
                    REDIS.setKey(key,JSON.stringify(local),(res)=>{
                        if(!done) return res.send({error:"Internal error, redis crush down."});
                        res.send({success:true});
                    });

                } catch (error) {
                    return res.send({error:"Failed to decode check account"});
                }
                console.log(data);

                res.send("");
            }); 
            
        });


        //1.PoE bind check, write from account on substrate account. 
        // the $ANK will be payed to the signer of the anchor. Not the owner of anchor. 
        // The PoE $ANK format
        // {
        //     ethereum:"ACCOUNT_OF_ETHEREUM",
        //     solana:"ACCOUNT_OF_SOLANA",
        // }
        //2.Check the payment hash, then sent the $ANK to target account

        //app.get("/:hash/:anchor/:block", (req, res) => {
        app.get("/:hash", (req, res) => {
            const hash = req.params.hash;       //payment hash
            
            if(hash.length!==66) return res.send({ error: "Invalid transaction hash." });
            //res.send(hash);

            const prefix=cfg.keys.prefix_record;
            const key=`${prefix}${hash}`;

            //1.confirm the substrate account which to accept the $ANK
            //2.confirm the payment hash, then calculate the amount
            //3.do pay to target account.
            // AnchorJS.view({name:anchor,block:block},"anchor",(data)=>{
            //     console.log(data);
            // });
    
            REDIS.exsistKey(key,(here)=>{
                if(here) return res.send({error: "Dumplicate request." });
                self.checkHashToGetAmount(hash,(amount)=>{

                    //1.saving the hash and set the status 
                    const row={
                        usdt:amount,
                        rate:cfg.rate,
                        coin:0,
                        hash:hash,
                        status:status.payment.WAITING_FOR_PAYMENT,
                    }
                    REDIS.setKey(key,JSON.stringify(row),(tag)=>{
                        if(!tag) return res.send({error: "Internal errro, failed to tag." });
                        console.log(key);
                        //2.get the Substrate account by record

                        //3.sent the $ANK coin;

                        //4.update charge order status
                        const norder=tools.clone(row);
                        norder.status=status.payment.ANK_PAYMENT_DONE;

                        //5.update the overview data


                    });
                });
            });
        });
    });
});