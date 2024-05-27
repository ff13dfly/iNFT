const Tanssi=require('../network/tanssi');
const {output}=require('../lib/output');
const tools=require('../lib/tools');

output("Ready to connect to Tanssi Network.","primary",true);
const block=384394;
Tanssi.init((wsAPI)=>{
    output("Connected.","primary",true);
    Tanssi.view(block,"blocknumber",(dt)=>{
        console.log(dt);
    });
});