const AnchorJS=require('../network/anchor.full');
const {output}=require('../lib/output');
const tools=require('../lib/tools');

let uri="ws://127.0.0.1:9944";

let linking = false;
let wsAPI = null;
const self={
    init: (ck) => {
        if (linking) return setTimeout(() => {
            self.init(ck);
        }, 500);

        if (wsAPI !== null) return ck && ck(wsAPI);

        linking = true;
        const { ApiPromise, WsProvider } = require("@polkadot/api");
        try {
            const provider = new WsProvider(uri);
            ApiPromise.create({ provider: provider }).then((api) => {
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
}

output(`Ready to connect to ${uri}.`,"primary",true);
self.init((wsAPI)=>{
    output("Connected.","primary",true);
    AnchorJS.set(wsAPI);

    const block=3582;
    const hash="";
    AnchorJS.search(block,"blocknumber",(dt)=>{
        console.log(dt);
    });
});