import Local from "../lib/local";
import Network from "../network/router";

const self={
    address:(ck)=>{
        const fa = Local.get("login");
        if(!fa) return ck && ck({error:"Invalid account"});
        try {
            const login=JSON.parse(fa);
            return ck && ck(login.address);
        } catch (error) {
            return ck && ck({error:"Invalid JSON file."});
        }
    },
    keyring:(password,ck)=>{
        const fa = Local.get("login");
        if(!fa) return ck && ck({error:"Invalid account"});
        try {
            const login=JSON.parse(fa);
            const chain=Network("anchor");
            chain.load(JSON.stringify(login),password,ck);
        } catch (error) {
            return ck && ck({error:"Invalid JSON file."});
        }
    },
}

export default self;