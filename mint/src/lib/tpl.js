import Local from "./local";
import Data from "./data";

const map={

}

const self = {
    target:(cid)=>{

    },
    current:()=>{
        const tpls = Local.get("template");
        if(!tpls) return false;

        try {
            const nlist = !tpls ? [] : JSON.parse(tpls);
            if(!nlist[0]) return false;


            return nlist[1];
        } catch (error) {
            return false;
        }
    },
}

export default self;