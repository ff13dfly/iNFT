/* 
*  API management
*  @auth [ Fuu ]
*  @creator Fuu
*  @date 2024-05-25
*  @functions
*  1.unique API entry here;
*  2.auto get spam from server;
*  3.unique request format; 
*/

import Local from "../lib/local";
import Config from "../system/config"
import Status from "../system/status";

const cfg=Config.get(["proxy","nodes","market"])[0];
const site=`${cfg.protocol}${cfg.domain}`;

let spam="";
let lock=false;
const funs={
    request:(mod,act,ck,param)=>{
        let url=`${site}?mod=${mod}&act=${act}`;
        if(param!==undefined){
            for(var k in param) url+=`&${k}=${param[k]}`;
        }
        if(spam) url+=`&spam=${spam}`;
        console.log(url);
        fetch(url).then((response)=>{
            if(!response.ok) return ck && ck({error:"Failed to get respons from "+url});
            response.text().then((res)=>{
                try {
                    const dt=JSON.parse(res);

                    if(dt.code && dt.code===444){
                        spam="";
                        return self.init(()=>{
                            funs.request(mod,act,ck,param);
                        });
                    } 

                    if(dt.message && dt.message.code){
                        if(dt.message.code===1 || dt.message.code===2){
                            spam="";
                            Local.remove("uuid");
                            Local.remove("token");
                            return self.init(()=>{
                                funs.request(mod,act,ck,param);
                            });
                        }
                    }
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
}

const self={
    init:(ck)=>{
        //1.check spam first;
        if(lock) return setTimeout(()=>{
            self.init(ck);
        },50);
        if(spam) return ck && ck(true);
        lock=true;

        Status.set(site,2);
        const uuid=Local.get("uuid");
        const token=Local.get("token");
        if(!uuid || !token){
            Local.remove("uuid");
            Local.remove("token");
            funs.request("system","new",(res)=>{
                if(!res.uuid || !res.token){
                    Status.set(site,13);
                    return ck && ck({error:"Invalide data"});
                } 
                Local.set("uuid",res.uuid);
                Local.set("token",res.token);
                funs.request("system","spam",(dt)=>{
                    if(!dt.spam){
                        Status.set(site,4);
                        return ck && ck({error:"Invalide data"});
                    } 
                    Status.set(site,1);
                    spam=dt.spam;
                    lock=false;
                    return ck && ck(true);
                },{uuid:res.uuid,token:res.token});
            });
        }else{
            funs.request("system","spam",(res)=>{
                if(!res.spam){
                    Status.set(site,4);
                    return ck && ck({error:"Invalide data"});
                } 
                Status.set(site,1);
                spam=res.spam;
                lock=false;
                return ck && ck(true);
            },{uuid:uuid,token:token});
        }
    },

    template:(page,ck,step)=>{
        self.init((ready)=>{
            if(ready.error) return ck && ck({error:"Internal error."});
            const param={page:page};
            if(step) param.step=parseInt(step);

            funs.request("template","list",(res)=>{
                if(res.success) return ck && ck(res);
                return ck && ck({error:"Failed to get data."});
            },param);
        });
    },
    selling:(page,ck,step)=>{
        self.init((ready)=>{
            if(ready.error) return ck && ck({error:"Internal error."});
            const param={page:page};
            if(step) param.step=parseInt(step);

            funs.request("selling","list",(res)=>{
                if(res.success) return ck && ck(res);
                return ck && ck({error:"Failed to get data."});
            },param);
        });
    },
    bounty:{
        exsist:(name,ck)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});
                const param={name:name};
                funs.request("bounty","exsist",(res)=>{
                    if(res.success) return ck && ck(res);
                    return ck && ck({error:"Failed to submit bounty."});
                },param);
            });
        },
        submit:(name,coin,start,end,template,detail,ck)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});
                const param={name:name,coin:coin,template:template,start:start,end:end,detail:detail};
                funs.request("bounty","submit",(res)=>{
                    if(res.success) return ck && ck(res);
                    return ck && ck({error:"Failed to submit bounty."});
                },param);
            });
        },
        register:(name,ck)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});
                const param={alink:name};
                funs.request("bounty","register",(res)=>{
                    if(res.success) return ck && ck(res);
                    return ck && ck({error:"Failed to register bounty."});
                },param);
            });
        },
        payment:(name,alink,ck)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});
                const param={bounty:name,alink:alink};
                funs.request("bounty","payment",(res)=>{
                    if(res.success) return ck && ck(res);
                    return ck && ck({error:"Failed to update payment details."});
                },param);
            });
        },
        apply:(name,target,record,ck)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});
                const param={alink:target,bounty:name,record:record};
                funs.request("bounty","apply",(res)=>{
                    if(res.success) return ck && ck(res);
                    return ck && ck({error:"Failed to appy bounty."});
                },param);
            });
        },
        divert:(name,index,hash,ck)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});
                const param={bounty:name,hash:hash,index:index};
                funs.request("bounty","divert",(res)=>{
                    if(res.success) return ck && ck(res);
                    return ck && ck({error:"Failed to appy bounty."});
                },param);
            });
        },
        target:(coin,ck)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});
                const param={symbol:coin};
                funs.request("bounty","target",(res)=>{
                    if(res.success) return ck && ck(res);
                    return ck && ck({error:"Failed to get bounty payment target details."});
                },param);
            });
        },
        list:(ck,page,step)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});
                const param={page:page-1};
                if(step) param.step=parseInt(step);
    
                funs.request("bounty","list",(res)=>{
                    if(res.success) return ck && ck(res);
                    return ck && ck({error:"Failed to get data."});
                },param);
            });
        },
        view:(alink,ck)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});
                const param={name:alink};
                funs.request("bounty","view",(res)=>{
                    if(res.success) return ck && ck(res);
                    return ck && ck({error:"Failed to get data."});
                },param);
            });
        },
    },
    list:{
        byAddress:(address,ck,page,step)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});

                const param={acc:address,page:!page?1:page};
                if(step) param.step=parseInt(step);
    
                funs.request("list","account",(res)=>{
                    if(res.success) return ck && ck(res);
                    return ck && ck({error:"Failed to get data."});
                },param);
            });
        },
    },
    comment:{
        submit:(address,content,alink,ck)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});
                const param={alink:alink,address:address,memo:content};
                funs.request("comment","add",(res)=>{
                    if(res.success) return ck && ck(res);
                    return ck && ck({error:"Failed to add comment."});
                },param);
            });
        },
        list:(alink,ck,page)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});
                const param={alink:alink,p:!page?1:page};
                funs.request("comment","list",(res)=>{
                    if(res.success) return ck && ck(res);
                    return ck && ck({error:"Failed to add comment."});
                },param);
            });
        },
    },
    trend:{
        overview:(ck)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});
                funs.request("trend","overview",(res)=>{
                    if(res.success) return ck && ck(res);
                    return ck && ck({error:"Failed to get data."});
                });
            });
        },
        chart:(start,step,ck)=>{
            self.init((ready)=>{
                if(ready.error) return ck && ck({error:"Internal error."});
                const param={start:start,step:step};
                funs.request("trend","chart",(res)=>{
                    if(res.success) return ck && ck(res);

                    return ck && ck({error:"Failed to get data."});
                },param);
            });
        },
    },
};

export default self;