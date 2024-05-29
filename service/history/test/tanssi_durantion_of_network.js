const Tanssi=require('../network/tanssi');
const {output}=require('../lib/output');
const tools=require('../lib/tools');

const self={

}

output("Ready to connect to Tanssi Network.","primary",true);
let last=tools.stamp();
const record=[];
Tanssi.init((wsAPI)=>{
    output("Connected","primary",true);
    Tanssi.subscribe("start",(block,hash)=>{
        const now=tools.stamp();
        const delta=tools.toF((now-last)*0.001);
        record.push(delta);
        output(`Subcribed (${delta}) : [ ${block} ] ${hash}`,"success",true);
        last=now;

        if(record.length%10===0){
            output("**********************************************","primary",true);
            const sum = record.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0);
              
            output(`Total: ${record.length} blocks, sum: ${sum}, avg: ${tools.toF(sum/record.length)}`,"",true);
            output("**********************************************","primary",true);
        }
    });
});