const { config } = require('./config.js');


let server=null;      //服务器实例

const self = {
    run:(cfg, ck)=>{
        if(server !=null) return ck && ck();
        server = app.listen(cfg.port, function() {
            const host = server.address().address;
            const port = server.address().port;
            console.log("Server start at http://%s:%s", host, port);
            //linker(config.polkadot,config.account,ck);
            return ck && ck();
        });
    },
};

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

self.run(config.server,()=>{
    console.log(`Here to link to Tanssi appchain`);
});
