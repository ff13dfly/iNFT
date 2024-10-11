import tools from "../lib/tools";
import Network from "../network/router";
import config from "../config";
//const axios= require("axios").default;
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
                status: "apply",
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
}

const self={
    submit:(pair,inft,bounty_alink,index,ck)=>{
        //1. write the apply data on chain
        const inft_alink=`anchor://${inft.name}/${inft.block}`;
        const obj={
            anchor:funs.apply.name(),
            raw:funs.apply.raw(inft_alink,bounty_alink,index,inft.owner),
            protocol:funs.apply.protocol(bounty_alink),
        }
        //console.log(obj);
        const chain=Network("anchor");
        chain.write(pair,obj,(process)=>{
            //console.log(process);
            if(process.msg) ck && ck({message:process.msg});

            //2.apply to server;
            if(process.status==="Finalized"){
                const hash=process.hash;        //finalized block number
                chain.view(hash,"block",(dt)=>{

                    //3.apply to server
                    const site=config.bounty.url;
                    const url=`${site}/apply/${obj.anchor}/${dt.block}`;
                    console.log(url);
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
                });
            }
        });
    },
}

export default self;