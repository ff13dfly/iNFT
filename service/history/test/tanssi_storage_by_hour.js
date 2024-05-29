//This test is for storaging the iNFT record to file per hour
//need to avoid JSON.parse, in case the iNFT number is huge

const {output}=require('../lib/output');
const tools=require('../lib/tools');
const File=require('../lib/file');

const hour=3600*1000;           //ms per hour
const day=24*hour;             //ms per day
const before=30;                   //days before now
let start=tools.stamp()-before*day;   //stamp of target time

const config={
    folder:"cache",
    seperator:"|",
}

const self={
    mockData:(n)=>{
        let str='';
        for(let i=0;i<n;i++){
            str+=btoa(JSON.stringify({
                name:"mock_"+tools.rand(1000,9999),
                raw:{target:"abc"},
                protocol:{fmt:"json",type:"inft"}
            }));
            str+=config.seperator;
        }
        return str;
    },
    getFolder:(stamp)=>{
        const dt=new Date(stamp);
        const year=dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const day = String(dt.getDate()).padStart(2, '0');
        const hour=dt.getHours();
        return `${year}/${month}/${day}/${hour}`
    },
}

let timer=setInterval(()=>{
    const name=`${start}.inft`;
    const data=self.mockData(tools.rand(10,200));
    const folder=self.getFolder(start);
    File.save(name,data,(res)=>{
        if(res.error){
            clearInterval(timer);
            return output(res.error,"error");
        } 
        output(`Saved, ${folder}`);
        start+=hour;
    },`${config.folder}/${folder}`);
    
},1000);