import Local from "./local";
import tools from "./tools";
import Render from "./render";

import Chain from "./chain";
import Network from "../network/router";

//This is the lib for iNFT local, cache all data including the filter queue

let basic=null;     //basic iNFTs parameters
let backup=[];      //backup of iNFTs
let raw=[];         //raw list of iNFT, copy of localstorage data
const map={};       //iNFT kv cache;  {name:"INDEX_IN_RAW"}
const imgs={};      //images cache by name, big one.
const filter={      //iNFT filter list page     
    fav:[],                 //fav list
    selling:[],             //selling list
    template:{},            //template list by hash
    other:{},
};

const config={
    prefix_length:11,
    step:9,               //default step of a page 
}

const funs={
    getDay:()=>{

    },
    getBasic:()=>{
        return {
            index:0,
            pre:`i${tools.char(config.prefix_length)}`,
            stamp:tools.stamp(),
            task:[],                                        //task of last mint
            history:{},                                     //record daily mint history by anchor name
        }
    },
    getAddress:()=>{
        const fa = Local.get("login");
        if(!fa) return false;
        try {
            const user=JSON.parse(fa);
            return user.address;
        } catch (error) {
            return false;
        }
    },
    getINFTMintDetail:(addr)=>{
        const mm = Local.get("mint");
        if(!mm){
            const ps={}
            ps[addr]=funs.getBasic();
            Local.set("mint",JSON.stringify(ps));
            return ps[addr];
        }

        try {
            const mints=JSON.parse(mm);
            if(!mints[addr]){
                mints[addr]=funs.getBasic();
                Local.set("mint",JSON.stringify(mints));
            } 
            return mints[addr];
        } catch (error) {
            Local.remove("mint");
            const ps={}
            ps[addr]=funs.getBasic();
            Local.set("mint",JSON.stringify(ps));
            return ps[addr];
        }
    },

    getNav:(cfg,page,step)=>{
        const nav={from:null,start:0,end:0,sum:0,empty:true};
        
        return nav;
    },

    getData:(start,end,from)=>{
        const arr=[];
        for(let i=start;i<end;i++){
            if(from===null){
                arr.push(raw[i]);
            }else{
                const index=Array.isArray(from)?filter[from[0]][from[1]][i]:filter[from][i];
                arr.push(raw[index]);
            }
        }
        return arr;
    },

    getRaw:(addr)=>{
        const ls = Local.get("list");
        if(!ls) return [];
        try {
            const ns=JSON.parse(ls);
            console.log(ns);
            if(!ns[addr]) return false;
            return ns[addr];
        } catch (error) {
            return [];
        }
    },
    getThumb:(iNFT,ck)=>{

    },

    cache:(addr)=>{
        funs.init();
        raw = funs.getRaw(addr);
        return true;
    },

    analysis:()=>{
        for(let i=0;i<raw.length;i++){
            const row=raw[i];
            map[row.anchor]=i;

            if(row.fav) filter.fav.push(i);

            const tpl=row.template.hash;
            if(!filter.template[tpl]) filter.template[tpl]=[];
            filter.template[tpl].push(i);
        }
        return true;
    },
    init:()=>{     //reset cache
        backup=[];
        raw=[];
        filter.fav=[];
        filter.selling=[];
        filter.template={};
    },
}

const self = {
    auto:()=>{
        //1.cache all localstorage data to cache
        const addr=funs.getAddress();
        if(!addr) return false;
        if(funs.cache(addr)) funs.analysis();

        //2.cache basic setting of mint
        basic=funs.getINFTMintDetail(addr);
        console.log(filter,map,basic);
    },

    list:(page,step,filter_cfg)=>{
        const addr=funs.getAddress();
        if(!addr) return false;

        const nav=funs.getNav(filter_cfg);
        if(nav.empty) return [];

        return funs.getData(nav.start,nav.end,nav.from);
    },

    update:()=>{        //update the iNFT list on localstorage
        const key="list";
        const addr=funs.getAddress();
        if(!addr) return false;
        const ls = Local.get(key);
        try {
            const ns=JSON.parse(ls);
            ns[addr]=raw;
            Local.set(key,JSON.stringify(ns));
            return true;

        } catch (error) {
            Local.remove(key);
            const ps={};
            ps[addr]=[];
            Local.set(key,JSON.stringify(ps));
            return true;
        }
    },
    thumbs:(names,ck,imap)=>{
        if(!imap) imap={};
        if(names.length===0) return ck && ck(imap);
        const name=names.pop();
        
        if(imgs[name]!==undefined){
            imap[name]=imgs[name];
            return self.thumbs(names,ck,imap);
        }

        if(!map[name]) return self.thumbs(names,ck,imap);
        const index=map[name];
        const single=raw[index];
        return funs.getThumb(single,(bs64)=>{
            imap[name]=bs64;    
            imgs[name]=bs64;        //set to cache 
            return self.thumbs(names,ck,imap);
        });
    },
    single:{    //single iNFT functions here.
        fav:(name)=>{
            if(!map[name]) return false
            const index=map[name];
            raw[index].fav=true;
            self.update();
            self.auto();            
        },
        unfav:(name)=>{
            if(!map[name]) return false
            const index=map[name];
            raw[index].fav=false;
            self.update();
            self.auto();
        },
        selling:(name,price,target)=>{

        },
        revoke:(name)=>{

        },
    },
    mint:{
        //start a task to mint; create the target task list
        start:(n)=>{

        },
        //update task status
        progress:(index,value,ck)=>{      

        },

        transfer:(password,to,amount,ck)=>{
            const fa = Local.get("login");
            if (fa === undefined) return false;
            Chain.load(fa, password, (pair) => {
                if (pair.error !== undefined) return false;
                Network("tanssi").transfer(pair,to,amount,()=>{

                });
            });
        },

        //get current task
        task:()=>{
            const addr=funs.getAddress();
            if(!addr) return false;
            const data=funs.getINFTMintDetail(addr);
            return data.task;
        },
        update:()=>{
            const key="mint";
            const addr=funs.getAddress();
            if(!addr) return false;
            const mm = Local.get(key);
            try {
                const mints=JSON.parse(mm);
                mints[addr]=basic;
                Local.set(key,JSON.stringify(mints));
                return true;
            } catch (error) {
                Local.remove(key);
                funs.getINFTMintDetail(addr);       //reset the localstorage
                return true;
            }
        },
    },
}

export default self;