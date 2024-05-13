const { config } = require('./config.js');
const tools = require('./lib/tools.js');
const IO = require('./lib/file.js');

const theme = {
    error: '\x1b[31m%s\x1b[0m',
    success: '\x1b[36m%s\x1b[0m',
    primary: '\x1b[33m%s\x1b[0m',
    dark: '\x1b[90m%s\x1b[0m',
};

const map={};           //the template cache
let server=null;
const self = {
    getCache:(cid,ck)=>{
        if(map[cid]) return ck && ck(map[cid]);
        const target=`${config.folder}/${cid}.json`;
        IO.read(target,(data)=>{
            if(!data.error) map[cid]=data;
            return ck && ck(data);
        });
    },
    run: (cfg, ck) => {
        if (server != null) return ck && ck();
        server = app.listen(cfg.port, function () {
            const host = server.address().address;
            const port = server.address().port;

            self.output(`******************************************************************************************`, "success", true);
            self.output(`IPFS template cache server start at http://${host}:${port}`, "success", true);
            self.output(`Author: Fuu, copyright 2024.`, "success", true);
            self.output(`******************************************************************************************`, "success", true);

            return ck && ck();
        });
    },

    output: (ctx, type, skip) => {
        const stamp = () => { return new Date().toLocaleString(); };
        if (!type || !theme[type]) {
            if (skip) return console.log(ctx);
            console.log(`[${stamp()}] ` + ctx);
        } else {
            if (skip) return console.log(theme[type], ctx);
            console.log(theme[type], `[${stamp()}] ` + ctx);
        }
    },
};

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

self.run(config.server, () => {
    self.output(`Cors should be supported by Nginx.`);
    self.output(`Copy the following URL to explorer to test: `,"", true);
    self.output(`http://localhost:${config.server.port}/bafkreiddy2rqwebw5gm5hdqqqrbsqzkrubjk3ldzr2bia5jk4w5o2w5w4i`,"primary", true);
    app.get('/', (req, res) => {
        res.send("");
    });

    //console.log(`Here to link to Tanssi appchain`);
    app.get('/:cid', (req, res) => {

        const cid = req.params.cid;
        self.output(`Request cid:${cid}`, "primary");
        if (cid.length !== 59) return res.send({ error: 'Invalid web3.storage CID.' });

        self.getCache(cid,(data)=>{
            if(data.error){
                res.send(JSON.stringify(data));
            }else{
                res.send(data);
            }
        });
    });
});