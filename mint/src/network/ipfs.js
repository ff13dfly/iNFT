//1.This is a lib to get IPFS template from gateway directly.
const map={}

const config={
    protocol:"https://",
    gateway:".ipfs.w3s.link",
}

const self={
    read:async (cid,ck)=>{
        const url=`${config.protocol}${cid}${config.gateway}`;

        //if there is cache, return a copy of it;
        if(map[cid]!==undefined) return JSON.parse(JSON.stringify(map[cid])); 
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                return ck && ck({error:"Network response was not ok"});
            }
            const ctx = await response.text();
            // return ck && ck(ctx);

            try {
                const json=JSON.parse(ctx);
                map[cid]=json;
                return ck && ck(json);
            } catch (error) {
                return ck && ck({error:"Invalid JSON IPFS file."});
            }

          } catch (error) {
            return ck && ck({error:error});
          }
    },
}

export default self;