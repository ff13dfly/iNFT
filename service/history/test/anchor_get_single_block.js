const Anchor=require('../network/anchor_simple');
const {output}=require('../lib/output');
const tools=require('../lib/tools');


output("Ready to connect to Tanssi Network.","primary",true);
const block=35401;
Anchor.init((wsAPI)=>{
    output("Connected.","primary",true);
    Anchor.view(block,"blocknumber",(dt)=>{
        console.log(dt);
    });
});