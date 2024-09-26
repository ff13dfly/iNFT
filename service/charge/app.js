const tools = require("./lib/tools.js");
const IO = require("./lib/file.js");
const { output } = require("./lib/output.js");
const express = require("express");
const bodyParser = require("body-parser");
const { REDIS } = require("./lib/redis.js");

const args = process.argv.slice(2);
const config_file=!args[0]?"config.json":args[0];
const status={
    ANK_PAYMENT_DONE:1,
    WAITING_FOR_PAYMENT:2,
    CHECK_FAILED:44,
};
const self={
    init:(ck)=>{
        output(`******************************************************************************************`, "success", true);
        output(`iNFT Charge System`, "success", true);
        output(`Author: Fuu, copyright 2024.`, "success", true);
        output(`******************************************************************************************`, "success", true);

        IO.read(config_file,(data)=>{
            if(data.error) return ck && ck({error:"Failed to load config file."});
            try {
                const config=JSON.parse(data);
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
        output(`******************************************************************************************`, "success", true);
        output(`IPFS template cache server start at http://${host}:${port}`, "success", true);
        output(`Author: Fuu, copyright 2024.`, "success", true);
        output(`******************************************************************************************`, "success", true);

        const demo_hash="0x093fe698eb6d3c35b66dbf46f81824fa0daf4f0db3a72e1881136a28274c86ac";
        const demo_anchor="hello";
        const demo_block=12323;
        output(`Cors should be supported by Nginx.`);
        output(`Copy the following URL to explorer to test: `,"", true);
        output(`http://localhost:${cfg.server.port}/${demo_hash}/${demo_anchor}/${demo_block}`,"primary", true);
        
        app.get("/", (req, res) => {
            res.send("");
        });

        //1.PoE bind check, write from account on substrate account. 
        // the $ANK will be payed to the signer of the anchor. Not the owner of anchor. 
        // The PoE $ANK format
        // {
        //     ethereum:"ACCOUNT_OF_ETHEREUM",
        //     solana:"ACCOUNT_OF_SOLANA",
        // }
        //2.Check the payment hash, then sent the $ANK to target account
        app.get("/:hash/:anchor/:block", (req, res) => {
            const hash = req.params.hash;       //payment hash
            const anchor=req.params.anchor;     //PoE anchor name
            const block=req.params.block;       //PoE record blocknumber
            if(hash.length!==66) return res.send({ error: "Invalid transaction hash." });
            //res.send(hash);

            const prefix=cfg.keys.prefix_record;
            const key=`${prefix}${hash}`;
            
            REDIS.exsistKey(key,(here)=>{
                if(here) return res.send({error: "Dumplicate request." });
                self.checkHashToGetAmount(hash,(amount)=>{

                    //1.saving the hash and set the status 
                    const row={
                        usdt:amount,
                        rate:cfg.rate,
                        coin:0,
                        hash:hash,
                        status:status.WAITING_FOR_PAYMENT,
                    }
                    REDIS.setKey(key,JSON.stringify(row),(tag)=>{
                        if(!tag) return res.send({error: "Internal errro, failed to tag." });
                        console.log(key);
                        //2.get the Substrate account by record

                        //3.sent the $ANK coin;

                        //4.update charge order status
                        const norder=tools.clone(row);
                        norder.status=status.ANK_PAYMENT_DONE;

                        //5.update the overview data


                    });
                });
            });
        });
    });
});