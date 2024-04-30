const { config } = require('./config.js');
const tools=require('./lib/tools.js');
const IO=require('./lib/file.js');

const theme = {
    error: '\x1b[31m%s\x1b[0m',
    success: '\x1b[36m%s\x1b[0m',
    primary: '\x1b[33m%s\x1b[0m',
    dark: '\x1b[90m%s\x1b[0m',
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
        const { ApiPromise, WsProvider } = require('@polkadot/api');
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
                console.log(`Saving history to cache: ${config.cache}`);
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
        return 1000000000000;
    },
    getMulti:()=>{
        //basic:1000000000000, multi: 10000
        //0000000000000
        return 100000000;
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
        wsAPI.query.system.account(from[0], (res) => {
            if (unsub != null) unsub();
            const data = res.toJSON().data;
            console.log(`Faucet account ${from[0]} free balance: ${tools.toF(data.free/self.getDivide(),8)}`);
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
        IO.read(`./account/${address}.json`,(fa)=>{
            console.log(fa);
        });
        return ck && ck();
    },
    transfer:(amount,target,day,ck)=>{
        //1.check balance is enough;
        self.balance(day,(pair)=>{
            if(exhoused || pair===false) return false;      //wethe low balance
            self.output(`Start to transfer ${tools.toF(amount*0.0001,6)} to ${target} on ${day}`,"primary");
            const m=self.getMulti();
            // setTimeout(()=>{
            //     console.log(`Done! transfer ${tools.toF(amount*0.0001,6)} to ${target} on ${day}`);
            //     map[target][day].confirmed=true;
            //     return ck && ck();
            // },24000);

            try {
                // let unsub = null;
                // wsAPI.query.system.account(pair.address, ({ nonce, data: balance }) => {
                //     unsub();
                //     //console.log(`balance.free: ${balance.free}`);
                //     if (balance.free < self.tranform(200)) return ck && ck(false);
                //     try {
                //         //注意，如果目标账户的coin小于100的时候，会转账失败
                //         wsAPI.tx.balances.transfer(ss58, self.tranform(amount)).signAndSend(pair, (res) => {
                //             var status = res.status;
                //             if (status.type === 'InBlock') {
                //                 return ck && ck(amount);
                //             }
                //         });
                //     } catch (error) {
                //         return ck && ck(false);
                //     }
                // }).then((fun) => {
                //     unsub = fun;
                // });
            } catch (error) {
                
            }
        });
    },
};

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//curl http://127.0.0.1:8888/5D5K7bHqrjqEMd9sgNeb28w9TsR8hFTTHYs6KTGSAZBhcePg

self.init(()=>{
    self.backup(()=>{
        self.run(config.server,()=>{
            //console.log(`Here to link to Tanssi appchain`);
            app.use((req, res)=>{
                const uri=req.url;
                self.output(`Request URI:${uri}(${uri.length})`,"primary");
                if(uri.length!==49) return res.send({error:'Invalid request.'});
                if(exhoused) return res.send({error:'Faucet pool is exhoused today.'});

                const addr=uri.slice(1,uri.length);
                const range=!map[addr]?config.amount.first:config.amount.normal;
                const day=tools.day();
                if(!map[addr]){
                    map[addr]={};
                    const first=tools.rand(range[0],range[1]);
                    map[addr][day]={amount:first,confirmed:false};
                    self.output(`First faucet: ${first}`)
                    self.transfer(first,addr,day);
                    return res.send({message:'Welcome, your faucet is sending.'});
                }else{
                    if(!map[addr][day]){
                        const amount=tools.rand(range[0],range[1]);
                        map[addr][day]={amount:first,confirmed:false};
                        self.output(`Normal faucet: ${amount}`)
                        self.transfer(amount,addr,day);
                        return res.send({message:'Faucet daily is sending.'});
                    }else{
                        if(map[addr][day].confirmed){
                            return res.send({message:'Try tomorrow.'});
                        }else{
                            return res.send({message:'Faucet is on progress.'});
                        }
                    }
                }
            });
        });
    }); 
});
