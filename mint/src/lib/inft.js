import Local from "./local";
import tools from "./tools";

let backup=[];      //backup of iNFTs
let raw=[];         //raw list of iNFT, copy of localstorage data
const map={};       //iNFT kv cache;  {name:"INDEX_IN_RAW"}
const filter={      //iNFT filter list page     
    fav:[],
    template:{},
};

const config={
    prefix_length:11,
}

const funs={
    getBasic:()=>{
        return {
            index:0,
            pre:`i${tools.char(config.prefix_length)}`,
            stamp:tools.stamp(),
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
        if(!mm) return false;
        try {
            const mints=JSON.parse(mm);
            if(!mints[addr]) return false;

            return mints[addr];
        } catch (error) {
            return false;
        }
    },

    cache:(addr)=>{ 
        const ls = Local.get("list");
        if(!ls) return false;
        funs.init();
        try {
            const ns=JSON.parse(ls);
            if(!ns[addr]) return false;
            raw=ns[addr];
            return true;
        } catch (error) {
            return false;
        }
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
        filter.template={};
    },
}

const self = {
    auto:()=>{
        const addr=funs.getAddress();
        if(!addr) return false;
        if(funs.cache(addr)) funs.analysis();
    },
    list:(page,step,filter)=>{
        const addr=funs.getAddress();
        if(!addr) return false;
    },
    update:()=>{        //update the iNFT list on localstorage
        const addr=funs.getAddress();
        if(!addr) return false;

    },
    single:{    //single iNFT functions here.
        fav:(name)=>{

        },
        unfav:(name)=>{

        },
    }
}

export default self;