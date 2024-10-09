import Local from "../lib/local";

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
    pair:(passoword,ck)=>{

    },
}

export default self;