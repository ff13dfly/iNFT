const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");

const config = {
    node: "wss://fraa-flashbox-2690-rpc.a.stagenet.tanssi.network",  //Tanssi appchain URI
    target: 12000,           //How long to create a new block
}

const subs = {};      //subscribe funs

const funs = {
    filter: (exs, method, status) => {
        console.log(exs);
        let arr = [];
        let stamp = 0;
        exs.forEach((ex, index) => {
            console.log(ex)
            // if(index===0){
            // 	stamp=ex.toHuman().method.args.now.replace(/,/gi, "");
            // }
            // if(index===0 || status[index]!=="ExtrinsicSuccess") return false;
            // const dt = ex.toHuman();
            // if (dt.method.method === method) {
            // 	const res = dt.method;
            // 	res.owner = dt.signer.Id;
            // 	res.stamp = stamp;
            // 	arr.push(res);
            // }
        });
        return arr;
    },
    status: (list) => {
        const evs = list.toHuman();
        const map = {};
        for (let i = 0; i < evs.length; i++) {
            const ev = evs[i], index = ev.phase.ApplyExtrinsic;
            if (ev.event.section !== "system") continue;
            map[index] = ev.event.method;
        }
        return map;
    },
}

let wsAPI = null;
let linking = false;
const self = {
    init: (ck) => {
        const uri = config.node;
        if (linking) return setTimeout(() => {
            self.init(ck);
        }, 500);

        if (wsAPI !== null) return ck && ck(wsAPI);

        linking = true;
        const provider = new WsProvider(uri);
        ApiPromise.create({ provider: provider }).then((api) => {
            console.log(`Linked to node ${uri}`);
            wsAPI = api;
            linking = false;
            wsAPI.rpc.state.getMetadata().then(() => {
                wsAPI.rpc.chain.subscribeFinalizedHeads((lastHeader) => {
                    const data = JSON.parse(JSON.stringify(lastHeader));
                    const block = data.number - 1;      //get the right block number
                    const hash = data.parentHash;     //get the finalized hash
                    for (let k in subs) {
                        subs[k](block, hash);
                    }
                });
                return ck && ck(wsAPI);

            }).catch((error)=>{
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
            linking = false;
            return ck && ck(error);
        });
    },
    reset: (ck, proxy) => {
        console.log(`Restart system link`);
    },

    unsubscribe: (key) => {
        delete subs[key];
    },
    subscribe: (key, fun) => {
        self.init(() => {
            if (subs[key] !== undefined) delete subs[key];     //remove old function 
            subs[key] = fun;     //add the subcribe function to the map
        });
    },
    divide: () => {
        return 1000000000000;
    },
    view: (value, type, ck) => {
        self.init(() => {
            switch (type) {
                case "anchor":
                    //1.if set block,search directly
                    if (value.block !== undefined) return wsAPI.rpc.chain.getBlockHash(value.block, (res) => {
                        const hash = res.toJSON();

                        wsAPI.rpc.chain.getBlock(hash).then((full) => {
                            let data = null;
                            full.block.extrinsics.forEach((ex, index) => {
                                const row = ex.toHuman();
                                const dt = row.method;

                                if (dt.method === "setAnchor" && dt.args.key === value.name) {
                                    data = {
                                        owner: row.signer.Id,
                                        name: dt.args.key,
                                        raw: dt.args.raw,
                                        protocol: dt.args.protocol,
                                        pre: parseInt(dt.args.pre),
                                        block: value.block
                                    }
                                }
                            });

                            if (data !== null) {
                                try {
                                    data.raw = JSON.parse(data.raw);
                                    data.protocol = JSON.parse(data.protocol);
                                    return ck && ck(data);
                                } catch (error) {
                                    return ck && ck(data);
                                }
                            } else {
                                return ck && ck(false);
                            }
                        });
                    });

                    //2.check the latest block of the name
                    self.view(value.name, "owner", (owner) => {
                        //console.log(owner);
                        return self.view({ name: value.name, block: owner.block }, "anchor", ck);
                    });

                    break;

                case "owner":
                    let unsub = null;
                    wsAPI.query.anchor.anchorOwner(value, (res) => {
                        unsub();
                        const dt = res.toJSON();
                        if (!dt) return ck && ck(false);

                        return ck && ck({ address: dt[0], block: dt[1] });
                    }).then((fun) => {
                        unsub = fun;
                    });
                    break;

                case "block":   //value: hash(64)
                    wsAPI.rpc.chain.getBlock(value).then((dt) => {
                        const obj = dt.toJSON();
                        return ck && ck({ block: obj.block.header.number });
                    });

                    break;
                case "detail":
                    wsAPI.rpc.chain.getBlock(value).then((dt) => {
                        const exs = dt.block.extrinsics;
                        const infts = [];
                        if (exs.length === 4) return ck && ck(infts);
                        console.log(`Not default: ${exs.length} exs.`);
                        exs.forEach((ex, index) => {
                            if (index < 4) return false;
                            const row = ex.toHuman();
                            //console.log(row);
                            infts.push(row);
                        });
                        return ck && ck(infts);
                    });
                    // wsAPI.query.system.events.at(value,(evs)=>{
                    //     const status=funs.status(evs);
                    //     const arr=funs.filter(evs,"TransactionFeePaid",status);
                    //     console.log(arr);
                    // });
                    break;
                case "blocknumber":   //value: hash(64)
                    wsAPI.rpc.chain.getBlockHash(value, (res) => {
                        const hash = res.toHex();
                        return self.view(hash, "detail", ck);
                    });

                    break;

                default:
                    break;
            }


        });
    },
    test: () => {
        test.auto();
    }
}

const test = {
    auto: () => {
        test.test_view();
    },
    test_view: () => {
        const block = 346158;
        self.view(block, "blocknumber", (dt) => {
            console.log(dt);
        });
    },
}

module.exports = self;