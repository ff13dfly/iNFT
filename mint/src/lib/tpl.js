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

        }else{
            funs.cacheIPFS(list,(dels)=>{
                return ck && ck(dels);
            });
        }
    },
    cache:(alinks,ck)=>{
        funs.cacheIPFS(alinks,(dels)=>{
            return ck && ck(dels);
        });
    },
    list:(only_cid)=>{
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