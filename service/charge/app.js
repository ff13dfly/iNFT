const tools = require("./lib/tools.js");
const IO = require("./lib/file.js");
const { output } = require("./lib/output.js");
const express = require("express");
const bodyParser = require("body-parser");
const { REDIS } = require("./lib/redis.js");

const args = process.argv.slice(2);
const config_file=!args[0]?"config.json":args[0];

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
    checkHash:(hash,ck)=>{

        return ck && ck(19.99);
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

        output(`Cors should be supported by Nginx.`);
        output(`Copy the following URL to explorer to test: `,"", true);
        output(`http://localhost:${cfg.server.port}/0x093fe698eb6d3c35b66dbf46f81824fa0daf4f0db3a72e1881136a28274c86ac`,"primary", true);
        
        app.get("/", (req, res) => {
            res.send("");
        });

        app.get("/:hash", (req, res) => {
            const hash = req.params.hash;
            if(hash.length!==66) return res.send({ error: "Invalid transaction hash." });
            //res.send(hash);

            const prefix=cfg.keys.prefix;
            const key=`${prefix}${hash}`;
            
            REDIS.exsistKey(key,(here)=>{
                if(here) return res.send({error: "Dumplicate request." });
                self.checkHash(hash,(amount)=>{
                    console.log(key,amount);

                    //1.saving the hash and set the status 
                    const row={
                        usdt:amount,
                        rate:cfg.rate,
                        coin:0,
                        hash:hash,
                    }

                    //2.sent the $ANK coin;

                    //3.update charge order status

                    //4.update the overview data

                });
            });
        });
    });
});