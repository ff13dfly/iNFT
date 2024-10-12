import tools from "../lib/tools";
import Network from "../network/router";
import config from "../config";
import Local from "../lib/local";

const funs={
    apply:{
        name:()=>{
            return `apply_${tools.char(10)}`.toLocaleLowerCase();
        },
        raw:(inft_alink,bounty_alink,index,address)=>{
            return {
                inft: inft_alink,        //apply inft anchor link
                bounty: {
                    target: bounty_alink,      //bounty anchor link
                    bonus: index,       //bonus index
                },
                receiver: {
                    network: "anchor",
                    address: address,
                },
                action: "apply",
            }
        },
        protocol:(bounty_alink)=>{
            return {
                fmt: "json",
                type: "data",
                app: "inft",
                ref: bounty_alink,
            };
        },
    },
    divert:{
        name:()=>{
            return `divert_${tools.char(10)}`.toLocaleLowerCase();
        },
        raw:(inft_alink,bounty_alink,judge_alink,owner,block)=>{
            return {
                inft: inft_alink,        //apply inft anchor link
                bounty:bounty_alink,     //bounty alink
                judge:judge_alink,       //judgement alink
                from:owner,              //owner before diverting
                block: block,            //divert transaction block number
                action: "divert",
            }
        },
        protocol:(bounty_alink)=>{
            return {
                fmt: "json",
                type: "data",
                app: "inft",
                ref: bounty_alink,
            };
        },
    },
    recordApply:(inft_alink,apply_alink,bounty_alink,index,ck)=>{
        //console.log(inft_alink,apply_alink,bounty_alink,index);
        const str=Local.get("apply");
        if(!str){
            const record={}
            record[apply_alink]={
                inft:inft_alink,
                bounty:bounty_alink,
                bonus:index,
            }
            Local.set("apply",JSON.stringify(record));
        }else{
            try {
                const record=JSON.parse(str);
                if(!record[apply_alink]){
                    record[apply_alink]={
                        inft:inft_alink,
                        bounty:bounty_alink,
                        bonus:index,
                    }
                    Local.set("apply",JSON.stringify(record));
                    return ck && ck(true);
                }else{
                    return ck && ck({error:"Record exsist"});
                }
            } catch (error) {
                Local.remove("apply");
                return ck && ck({error:"Invalid record data"});
            }
        }
    },
    clearRecord:(apply_alink)=>{
        const str=Local.get("apply");
        if(!str) return false;
        try {
            const record=JSON.parse(str);
            delete record[apply_alink];
            Local.set("apply",JSON.stringify(record));
            return true;
        } catch (error) {
            Local.remove("apply");
            return false;
        }
    },
    fetchData:(url,ck,onError)=>{
        fetch(url).then((response)=>{
            if(!response.ok){
                if(onError) onError();
                return ck && ck({error:"Failed to get respons from "+url});
            } 
            response.text().then((res)=>{
                try {
                    const dt=JSON.parse(res);
                    if(dt.error && onError) onError();;
                    return ck && ck(dt);
                } catch (error) {
                    if(onError) onError();
                    return ck && ck({error:"Invalide content, please chech the response from server."})
                }
            }).catch((error)=>{
                if(onError) onError();
                return ck && ck({error:error});
            });
        }).catch((error)=>{
            if(onError) onError();
            return ck && ck({error:error});
        });
    },
}
const chain=Network("anchor");
const self={
    submit:(pair,inft,bounty_alink,index,ck)=>{
        //console.log(pair,inft,bounty_alink,index);
        //return true;
        //1. write the apply data on chain
        const inft_alink=`anchor://${inft.name}/${inft.block}`;
        const obj={
            anchor:funs.apply.name(),
            raw:funs.apply.raw(inft_alink,bounty_alink,index,inft.owner),
            protocol:funs.apply.protocol(bounty_alink),
        }
        //console.log(obj);
        chain.write(pair,obj,(process)=>{
            //console.log(process);
            if(process.msg) ck && ck({message:process.msg});

            //2.apply to server;
            if(process.status==="Finalized"){
                const hash=process.hash;        //finalized block number
                chain.view(hash,"block",(dt)=>{

                    //3.record  to local
                    const apply_alink=`anchor://${obj.anchor}/${dt.block}`;
                    //console.log(apply_alink);
                    funs.recordApply(inft_alink,apply_alink,bounty_alink,index,(noted)=>{
                        console.log(noted);

                        if(noted.error) return ck && ck(noted);

                        //4.apply to server
                        const site=config.bounty.url;
                        const url=`${site}/apply/${obj.anchor}/${dt.block}`;
                        //console.log(url);
                        funs.fetchData(url,(result)=>{
                            return ck && ck(result);
                        },()=>{
                            funs.clearRecord(apply_alink);
                        });
                        // fetch(url).then((response)=>{
                        //     if(!response.ok){
                        //         funs.clearRecord(apply_alink);
                        //         return ck && ck({error:"Failed to get respons from "+url});
                        //     } 
                        //     response.text().then((res)=>{
                        //         try {
                        //             const dt=JSON.parse(res);
                        //             if(dt.error) funs.clearRecord(apply_alink);
                        //             return ck && ck(dt);
                        //         } catch (error) {
                        //             funs.clearRecord(apply_alink);
                        //             return ck && ck({error:"Invalide content, please chech the response from server."})
                        //         }
                        //     }).catch((error)=>{
                        //         funs.clearRecord(apply_alink);
                        //         return ck && ck({error:error});
                        //     });
                        // }).catch((error)=>{
                        //     funs.clearRecord(apply_alink);
                        //     return ck && ck({error:error});
                        // });
                    });
                });
            }
        });
    },

    divert:(pair,inft_alink,judge_alink,bounty_alink,target,ck)=>{
        //1.divert iNFT to target account
        const ak=tools.decode(inft_alink);
        chain.divert(pair,ak.name,target,(process)=>{
            if(process.msg) ck && ck({message:process.msg});
            if(process.status==="Finalized"){
                const hash=process.hash;        //finalized block number
                chain.view(hash,"block",(dt)=>{

                    //2.write divert information on chain
                    const obj={
                        anchor:funs.divert.name(),
                        raw:funs.divert.raw(
                            inft_alink,
                            bounty_alink,
                            judge_alink,
                            pair.address,
                            dt.block
                        ),
                        protocol:funs.divert.protocol(bounty_alink),
                    }
                    
                    chain.write(pair,obj,(onchain)=>{
                        if(onchain.status==="Finalized"){
                            const divert_hash=onchain.hash;
                            chain.view(divert_hash,"block",(dd)=>{
                                //3.submit divert information to system
                                const site=config.bounty.url;
                                const url=`${site}/divert/${obj.name}/${dd.block}`;
                                console.log(url);
                                // funs.fetchData(url,(result)=>{
                                //     return ck && ck(result);
                                // },()=>{
                                //     funs.clearRecord(apply_alink);
                                // });
                            });
                        }
                        
                    });
                });
            }
        });

        

        
    },
}

export default self;