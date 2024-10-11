import tools from "../lib/tools";
import Network from "../network/router";
import config from "../config";

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
    }
}

const self={
    list:(ck)=>{
        funs.init(()=>{
            return ck && ck(list);
        });
    },
    view:(alink,ck)=>{
        if(cache[alink]!==undefined) return ck && ck(cache[alink]);
        const ak=tools.decode(alink);
        const url=`${config.bounty.url}/view/${ak.name}/${ak.block}`;
        console.log(url);
        funs.getData(url,(bt)=>{
            if(!bt.error) cache[alink]=bt;
            return ck && ck(bt);
        });
    },
    apply:(alink,ck)=>{

    },
    divert:(alink,ck)=>{

    },
}

export default self;