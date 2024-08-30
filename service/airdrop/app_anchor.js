const { config } = require("./config.js");
const tools=require("./lib/tools.js");
const IO=require("./lib/file.js");

const theme = {
    error: "\x1b[31m%s\x1b[0m",
    success: "\x1b[36m%s\x1b[0m",
    primary: "\x1b[33m%s\x1b[0m",
    dark: "\x1b[90m%s\x1b[0m",
};

let server=null;        //express instance
let wsAPI = null;       //polkadot linker  
let linking = false;    //linking locker for polkadot
let map={};             //airdrop record
let timer=null;         //autosave timer
let exhoused=false;     //wether balance low
const self = {
    init: (ck) => {
        const uri=config.node;
        if (linking) return setTimeout(() => {
            self.init(ck);
        }, 500);

        if (wsAPI !== null) return ck && ck(wsAPI);

        linking = true;
        const { ApiPromise, WsProvider } = require("@polkadot/api");
        try {
            const provider = new WsProvider(uri);
            ApiPromise.create({ provider: provider }).then((api) => {
                self.output(`******************************************************************************************`,"success",true);
                self.output(`Linked to node: ${config.node}`,"success",true);
                wsAPI = api;
                linking = false;
                return ck && ck(wsAPI);
            });
        } catch (error) {
            console.log(error);
            linking = false;
            return ck && ck(error);
        }
    },
    backup:(ck)=>{
        const target=config.cache;
        if(timer===null){
            timer=setInterval(()=>{
                IO.save(config.cache,JSON.stringify(map),()=>{
                    //self.output(`Saving history to cache: ${config.cache}`);
                });
            },config.autosaving);
        }
        return ck && ck();
    },
    run:(cfg, ck)=>{
        if(server !=null) return ck && ck();
        server = app.listen(cfg.port, function() {
            const host = server.address().address;
            const port = server.address().port;
            
            self.output(`Faucet server start at http://${host}:${port}`,"success",true);
            self.output(`Author: Fuu, copyright 2024.`,"success",true);
            self.output(`******************************************************************************************`,"success",true);
            //console.log("Faucet server start at http://%s:%s", host, port);
            return ck && ck();
        });
    },
    getDivide:()=>{
        return 1000000;
    },
    getMulti:()=>{
        return 1;
    },
    format:(obj)=>{
        return JSON.stringify(obj)
    },
    output:(ctx, type, skip) => {
        const stamp = () => { return new Date().toLocaleString(); };
        if (!type || !theme[type]) {
            if (skip) return console.log(ctx);
            console.log(`[${stamp()}] ` + ctx);
        } else {
            if (skip) return console.log(theme[type], ctx);
            console.log(theme[type], `[${stamp()}] ` + ctx);
        }
    },
    balance:(day,ck)=>{
        let unsub = null;
        const n=parseInt(day.slice(6,8));
        const index=n%config.account.length;
        const from=config.account[index];
        self.output(`Day: ${n},JSON.stringify(from)`,"primary");
        wsAPI.query.system.account(from[0], (res) => {
            if (unsub != null) unsub();
            const data = res.toJSON().data;
            self.output(`Faucet account ${from[0]} free balance: ${tools.toF(data.free/self.getDivide(),8)}`,"primary");
            if(data.free<config.low){
                exhoused=true;     //if balance low, 
                return ck && ck(false);
            } 
            return self.load(from[0],from[1],ck);
        }).then((fun) => {
            unsub = fun;
        });
    },
    load:(address,pass,ck)=>{
        const account_file=`./account/${address}.json`;
        self.output(account_file,"primary");
        IO.read(account_file,(fa)=>{
            //console.log(fa);
            self.output(`Read ${account_file} successful.`,"primary");
            self.getPair(fa,pass,ck);
        });
    },
    getPair:(fa,password,ck)=>{
        const {Keyring}=require("@polkadot/api");
        try {
            const acc=JSON.parse(fa);
            const keyring = new Keyring({ type: "sr25519" });
            const pair = keyring.createFromJson(acc);
            try {
                pair.decodePkcs8(password);
                return  ck && ck(pair);
            } catch (error) {
                return ck && ck({error:"Invalid passoword"});
            }
        } catch (error) {
            return ck && ck({error:"Invalid file"}); 
        }
    },
    transfer:(amount,target,day,ck)=>{
        //1.check balance is enough;
        self.balance(day,(pair)=>{
            if(exhoused || pair===false) return false;      //wethe low balance
            self.output(`Start to transfer ${amount} to ${target} on ${day}`,"primary");

            const m=self.getMulti();
            try {
                //const m=self.getMulti();
                wsAPI.tx.balances.transferAllowDeath(target,parseInt(amount)).signAndSend(pair, (res) => {
                    const status = res.status.toJSON();
                    if(status && status.finalized){
                        map[target][day].confirmed=true;
                        return ck && ck(status.finalized);
                    }
                });
            } catch (error) {
                self.output(error,"error");
            }
        });
    },
};

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//catch error in order to avoid crashing.
process.on("unhandledRejection", (reason, promise) => {
    self.output(`UnhandledRejection`,"error");
});
  
process.on("uncaughtException", (error) => {
    self.output(`uncaughtException`,"error");
});


self.init(()=>{
    self.backup(()=>{
        //console.log(wsAPI.tx.balances);
        self.run(config.server,()=>{
            self.output(`Cors should be supported by Nginx.`);

            app.get("/",(req, res)=>{
                res.send("");
            });

            //console.log(`Here to link to Tanssi appchain`);
            app.get("/:address",(req, res)=>{
                const addr=req.params.address;
                self.output(`Request Address:${addr}`,"primary");
                if(addr.length!==48) return res.send({error:"Invalid request."});

                if(exhoused) return res.send({error:"Faucet pool is exhoused today."});

                const range=!map[addr]?config.amount.first:config.amount.normal;
                const day=tools.day();
                if(!map[addr]){
                    map[addr]={};
                    const first=tools.rand(range[0],range[1]);
                    map[addr][day]={amount:first,confirmed:false};
                    self.output(`First faucet: ${first}`)
                    self.transfer(first,addr,day,(txHash)=>{
                        self.output(`Transaction done. Hash: ${txHash}`,"primary");
                        self.output(`---------------------------`,"primary");
                    });
                    return res.send({message:"Welcome, your faucet is sending."});
                }else{
                    if(!map[addr][day]){
                        const amount=tools.rand(range[0],range[1]);
                        map[addr][day]={amount:amount,confirmed:false};
                        self.output(`Normal faucet: ${amount}`)
                        self.transfer(amount,addr,day);
                        return res.send({message:"Faucet daily is sending."});
                    }else{
                        if(map[addr][day].confirmed){
                            return res.send({message:"Try tomorrow."});
                        }else{
                            return res.send({message:"Faucet is on progress."});
                        }
                    }
                }
            });
        });
    }); 
});
