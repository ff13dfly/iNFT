const config={
    node:"wss://fraa-flashbox-2690-rpc.a.stagenet.tanssi.network",  //Tanssi appchain URI
    target:12000,           //How long to create a new block
}
const subs={};      //subscribe funs

const limits={
    key:40,					//Max length of anchor name ( ASCII character )
    protocol:256,			//Max length of protocol	
    raw:350,		        //Max length of raw data
	address:48,				//SS58 address length
};

const funs={
    limited:(key,raw,protocol,address)=>{
        if(key!==undefined) return key.length>limits.key?true:false;
        if(protocol!==undefined) return protocol.length>limits.protocol?true:false;
        if(raw!==undefined) return raw.length>limits.raw?true:false;
		if(address!==undefined) return address.length!==limits.address?true:false;
        return false;
    },
}

let wsAPI = null;
let linking = false;
const self={
    init: (ck) => {
        const uri=config.node;
        if (linking) return setTimeout(() => {
            self.init(ck);
        }, 500);

        if (wsAPI !== null) return ck && ck(wsAPI);

        linking = true;
        const { ApiPromise, WsProvider } = window.Polkadot;
        try {
            const provider = new WsProvider(uri);
            ApiPromise.create({ provider: provider }).then((api) => {
                console.log(`Linked to node.`);
                wsAPI = api;
                linking = false;
                return ck && ck(wsAPI);
            });
        } catch (error) {
            console.log(error);
            linking = false;
            return ck && ck(error);
        }
    },
    divide:()=>{
        return 1000000000000;
    },

    balance:(address,ck)=>{
        let unsub=null;
        wsAPI.query.system.account(address, (res) => {
			if(unsub!=null) unsub();
			const data=res.toJSON().data;
			return ck && ck(data);
		}).then((fun)=>{
			unsub=fun;
		});
    },
    subscribe:(key,fun)=>{
        self.init(()=>{
            wsAPI.rpc.chain.subscribeFinalizedHeads((lastHeader) => {
                const data=JSON.parse(JSON.stringify(lastHeader));
                const block=data.number-1;      //get the right block number
                const hash=data.parentHash;     //get the finalized hash
                for(let k in subs){
                    subs[k](block,hash);
                }
            });
            subs[key]=fun;
        });
    },
    write:(pair,obj,ck)=>{
        self.init(()=>{
            let {anchor,raw,protocol}=obj;
            if (typeof protocol !== 'string') protocol = JSON.stringify(protocol);
            if (typeof raw !== 'string') raw = JSON.stringify(raw);
            if(funs.limited(anchor,raw,protocol)) return ck && ck({error:"Params error"});

            const pre=0;
            console.log(anchor, raw, protocol, pre);
            wsAPI.tx.anchor.setAnchor(anchor, raw, protocol, pre).signAndSend(pair, (res) => {
                //console.log(res.status.toHuman());
                const dt=res.toHuman();
                return ck && ck(dt);
            });
        })
        

        // if (!self.ready()) return ck && ck({error:"No websocke link."});
		// if (typeof protocol !== 'string') protocol = JSON.stringify(protocol);
		// if (typeof raw !== 'string') raw = JSON.stringify(raw);
		// if(self.limited(anchor,raw,protocol)) return ck && ck({error:"Params error"});

		// self.owner(anchor,(owner,block)=>{
		// 	if(owner!==false &&  owner!==pair.address) return ck && ck({error:`Not the owner of ${anchor}`});
		// 	self.balance(pair.address,(amount)=>{
		// 		if(amount.free<100*1000000000000) return ck && ck({error:'Low balance'});
		// 		const pre = owner===false?0:block;
		// 		try {
		// 			wsAPI.tx.anchor.setAnchor(anchor, raw, protocol, pre).signAndSend(pair, (res) => {
		// 				return ck && ck(self.process(res));
		// 			});
		// 		} catch (error) {
		// 			return ck && ck({error:error});
		// 		}
		// 	});
		// });
    },
    view:(value,type,ck)=>{
        self.init(()=>{
            switch (type) {
                case "anchor":
                    
                    break;
    
                case "block":
                    //console.log(wsAPI);
                    wsAPI.rpc.chain.getBlock(value).then((dt) => {
                        const obj=dt.toJSON();
                        return ck && ck({block:obj.block.header.number});
                    });
                    
                    break;
            
                default:
                    break;
            }

            
        });
    },
}

export default self;