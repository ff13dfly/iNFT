import Local from "./local";
import Data from "./data";
import IPFS from "../network/ipfs";

let locker_remove=false;     //remove locker;
let locker_insert=false;    //insert locker

const funs={
    cacheIPFS:(alinks, ck, dels)=>{
        if (dels === undefined) dels = [];
        if (alinks.length === 0) return ck && ck(dels);
        const single = alinks.pop();
        if(Data.exsistHash("cache", single)){
            return funs.cacheIPFS(alinks, ck, dels);
        }else{
            return IPFS.read(single, (ctx) => {
                if(!ctx || ctx.error!==undefined){
                    const left = alinks.length;
                    dels.push(left);
                    return funs.cacheIPFS(alinks, ck, dels);
                }else{
                    Data.setHash("cache", single, ctx);

                    return funs.cacheIPFS(alinks, ck, dels);
                }
            });
        }
    },
    autosetTemplate:()=>{
        const list=self.list();
        if(list===false) return false;
        const active=list[0];
        const def=Data.getHash("cache", active.alink);
        def.cid=active.alink;
        Data.set("template", def);
        return true;
    },
    getFormat:(cid)=>{
        return {
            alink: cid,
            name: "",
            offset:[],              //customized offset value
            tags: []
        }
    }
}

const self = {
    auto:(ck)=>{
        const list=self.list(true);
        if(list===false){
            //no template, need to init it;
            return ck && ck();
        }else{
            funs.cacheIPFS(list,(dels)=>{
                //1. need to remove the dels templates
                if(dels.length!==0){
                    console.log(`Need to remove invalid templates.`);
                }

                //2. set template cache
                funs.autosetTemplate();

                return ck && ck(dels);
            });
        }
    },
    cache:(alinks,ck)=>{
        funs.cacheIPFS(alinks,(dels)=>{
            return ck && ck(dels);
        });
    },
    current:(only_cid)=>{
        const tpl=Data.get("template");
        if(only_cid) return tpl.cid;
        return tpl;
    },
    list:(only_cid)=>{  //if only_cid=true, filter out the cid from templates.
        const tpls = Local.get("template");
        if(!tpls) return false;
        try {
            const nlist = !tpls ? [] : JSON.parse(tpls);
            if(only_cid){
                const arr=[];
                for(let i=0;i<nlist.length;i++){
                    arr.push(nlist[i].alink);
                }
                return arr;
            }else{
                return nlist;
            }
            
        } catch (error) {
            return false;
        }
    },
    target:(index)=>{       //get local storaged template information
        const tpls=self.list();
        if(tpls===false || tpls.length===0) return false;
        const order=!index?0:index;
        if(!tpls[order]) return false;
        return tpls[order];
    },
    remove:(index)=>{
        const arr=self.list();
        const nlist=[];
        for(let i=0;i<arr.length;i++){
            if(index!==i) nlist.push(arr[i]);
        }
        Local.set("template",JSON.stringify(nlist));
    },
    change:(index)=>{
        const arr=self.list();
        const nlist=[arr[index]];
        for(let i=0;i<arr.length;i++){
            if(index!==i) nlist.push(arr[i]);
        }
        Local.set("template",JSON.stringify(nlist));
    },
    add:(cid,ck,head)=>{
        //check data from IPFS first
        funs.cacheIPFS([cid],(dels)=>{
            if(dels.length!==0) return ck && ck(false);

            const arr=self.list();
            const ntpl=funs.getFormat(cid);
            head?arr.unshift(ntpl):arr.push(ntpl);
            Local.set("template",JSON.stringify(arr));

            return ck && ck(true);
        });
    },
    clean:()=>{
        Local.remove("template");
    },
    
}

export default self;