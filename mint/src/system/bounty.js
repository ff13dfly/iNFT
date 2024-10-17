import tools from "../lib/tools";
import Network from "../network/router";
import config from "../config";
import TPL from "./tpl";

let list=null;      //bounty list
const cache={};     //bounty cache "alink" => bounty object

const chain = Network("anchor");
const funs={
    init:(ck)=>{
        if(list!==null) return ck && ck();

        const source=config.bounty.source;
        chain.view({name:source.name}, "anchor", (ak) => {
            if(ak===false || !ak.raw || !ak.raw.data){
                list=[];
                return false;
            }
            list=tools.clone(ak.raw.data);
            return ck && ck();
        });
    },
    getData:(url,ck)=>{
        //need NodeJS cors support
        fetch(url).then((response)=>{
            if(!response.ok) return ck && ck({error:"Failed to get respons from "+url});
            response.text().then((res)=>{
                try {
                    const dt=JSON.parse(res);
                    return ck && ck(dt);
                } catch (error) {
                    return ck && ck({error:"Invalide content, please chech the response from server."})
                }
            }).catch((error)=>{
                return ck && ck({error:error});
            });
        }).catch((error)=>{
            return ck && ck({error:error});
        });
    },
    format:{
        apply:{
            name:()=>{},
            raw:()=>{},
            protocol:(bounty)=>{

            },
        }
    },
    checkBountyFormat:(raw)=>{
        //console.log(raw);
        if(!raw.template || !raw.template.cid || !raw.template.origin) return false;
        if(!raw.bonus)return false;
        if(!raw.consignee)return false;
        return true;
    },
}

const self={
    list:(ck)=>{
        funs.init(()=>{
            return ck && ck(list);
        });
    },
    view:(alink,ck,force)=>{
        if(!force && cache[alink]!==undefined) return ck && ck(cache[alink]);
        const ak=tools.decode(alink);
        const url=`${config.bounty.url}/view/${ak.name}/${ak.block}`;
        funs.getData(url,(bt)=>{
            if(bt.error) return ck && ck(bt);
            if(!funs.checkBountyFormat(bt.raw)) return ck && ck({error:"Invalid bounty."});

            const cid = bt.raw.template.cid;
            TPL.view(cid, (dt) => {
                bt.template=dt;
                cache[alink]=bt;
                return ck && ck(bt);
            });
        });
    },
    group:(apls,ck,map)=>{
        if(!map) map={};
        if(apls.length===0) return ck && ck(map);
        const row=apls.pop();
        if(!map[row.bonus]) map[row.bonus]={going:[],winner:[]};

        //1.if payment, there is winner
        if(row.payment){
            map[row.bonus].winner.push({
                address:row.payment.to,
                from:row.payment.from,
            });
            return self.group(apls,ck,map);
        } 

        //2.check the apply progress
        const task={inft:row.inft};
        const chain=Network("anchor");
        const ak=tools.decode(row.apply);
        chain.view(ak,"anchor",(apply)=>{
            if(apply===false) return ck && ck({error:"Invalid apply on-chain data."});
            task.apply={
                alink:row.apply,
                signer:apply.signer,
            };

            if(!row.judge){
                map[row.bonus].going.push(task);
                return self.group(apls,ck,map);
            } 

            //3. check the judge data to confirm
            const judge_ak=tools.decode(row.judge);
            chain.view(judge_ak,"anchor",(judge)=>{
                if(judge===false) return ck && ck({error:"Invalid judge on-chain data."});
                if(judge.raw.apply!==row.apply) return ck && ck({error:"Invalid judge for apply."});

                task.judge={
                    alink:row.judge,
                    result:judge.raw.result,
                };
                map[row.bonus].going.push(task);
                return self.group(apls,ck,map);
            });
        });
    },
}

export default self;