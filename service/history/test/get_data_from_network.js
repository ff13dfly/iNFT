const Tanssi=require('../network/tanssi');
const {output}=require('../lib/output');
const tools=require('../lib/tools');

const config={
    range:10,
}

const self={
    getData:(block,ck,count,map)=>{
        if(count===undefined) count=config.range;
        if(!map) map={};
        if(count < 1) return ck && ck(map);
        return Tanssi.view(block,"blocknumber",(res)=>{
            if(res.length!==0){
                map[block]=res;
            }
            count--;
            block--;
            output(`[${block}] ${count}`);
            return self.getData(block,ck,count,map);
        });
    },
}

let first=true;
output("Ready to connect to Tanssi Network.","primary",true);
let start=0;
Tanssi.init((wsAPI)=>{
    Tanssi.subscribe("start",(block,hash)=>{
        if(first){
            start=tools.stamp();
            first=false;                //set tag to start
            self.getData(block,(map)=>{
                console.log(map);
                output(`Total ${config.range} blocks, cost ${tools.toF((tools.stamp()-start)*0.001)}s.`)
            });
        }
    });
});