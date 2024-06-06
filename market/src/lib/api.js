import Local from "./local";
import Data from "./data";

const config={
    site:"http://localhost/inFT/service/api/",
}

const funs={
    request:(mod,act,ck,param)=>{
        let url=`${config.site}?mod=${mod}&act=${act}`;
        if(param!==undefined){
            for(var k in param) url+=`&${k}=${param[k]}`;
        }
        const spam=Data.getHash('cache','spam');
        if(spam) url+=`&spam=${spam}`;
        console.log(url);
        fetch(url).then((response)=>{
            if(!response.ok) return ck && ck({error:'Failed to get respons from '+url});
            response.text().then((res)=>{
                try {
                    const dt=JSON.parse(res);
                    return ck && ck(dt);
                } catch (error) {
                    return ck && ck({error:"Invalide content"})
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
        const spam=Data.getHash('cache','spam');
        if(spam) return ck && ck(true);

        const uuid=Local.get('uuid');
        const token=Local.get('token');
        if(!uuid || !token){
            Local.remove('uuid');
            Local.remove('token');
            funs.request('system','new',(res)=>{
                if(!res.uuid || !res.token) return ck && ck({error:"Invalide data"});
                Local.set("uuid",res.uuid);
                Local.set("token",res.token);
                funs.request('system','spam',(dt)=>{
                    if(!dt.spam) return ck && ck({error:"Invalide data"});
                    Data.setHash("cache","spam",dt.spam);
                    return ck && ck(true);
                },{uuid:res.uuid,token:res.token});
            });
        }else{
            funs.request('system','spam',(res)=>{
                if(!res.spam) return ck && ck({error:"Invalide data"});
                Data.setHash("cache","spam",res.spam);
                return ck && ck(true);
            },{uuid:uuid,token:token});
        }
    },

    template:(page,ck)=>{
        self.init((ready)=>{
            if(ready.error) return ck && ck({error:"Internal error."});
            funs.request("template","list",(res)=>{
                if(res.success) return ck && ck(res);
                return ck && ck({error:"Failed to get data."});
            },{page:page});
        });
    },
};

export default self;