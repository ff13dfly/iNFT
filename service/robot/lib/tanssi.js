const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');

const limits = {
    key: 40,					//Max length of anchor name ( ASCII character )
    protocol: 256,			//Max length of protocol	
    raw: 350,		        //Max length of raw data
    address: 48,				//SS58 address length
};


const funs={
    limited: (key, raw, protocol, address) => {
        if (key !== undefined) return key.length > limits.key ? true : false;
        if (protocol !== undefined) return protocol.length > limits.protocol ? true : false;
        if (raw !== undefined) return raw.length > limits.raw ? true : false;
        if (address !== undefined) return address.length !== limits.address ? true : false;
        return false;
    },
    decodeProcess: (obj, ck) => {
        if (!obj || obj.dispatchError !== undefined) return ck && ck({ error: "Failed to write to chain." });
        if (!obj.status) return ck && ck({ error: "Invalid format" });
        if (obj.status === "Ready") {
            return ck && ck({ msg: "Ready to write to network.", success: true, status: "Ready", code: 2 });
        } else if (obj.status.Broadcast) {
            return ck && ck({ msg: "Broadcast to nodes.", success: true, status: "Broadcast", code: 3 });
        } else if (obj.status.InBlock) {
            return ck && ck({ msg: "Already packed, ready to update.", success: true, status: "InBlock", code: 5 });
        } else if (obj.status.Retracted) {
            return ck && ck({ msg: "Trying to write.", success: true, status: "Retracted", code: 4 });       //not everytime
        } else if (obj.status.Finalized) {
            return ck && ck({ msg: "Done, write to network", success: true, status: "Finalized", hash: obj.status.Finalized, code: 8 });
        } else {
            return ck && ck({ error: "Unknow result" });
        }
    },
}

let wsAPI = null;
let linking = false;
const self = {
    init: (ck, uri) => {
        if (linking) return setTimeout(() => {
            self.init(ck);
        }, 500);

        if (wsAPI !== null) return ck && ck(wsAPI);

        linking = true;
        const provider = new WsProvider(uri);
        ApiPromise.create({ provider: provider }).then((api) => {
            console.log(`Linked to node ${uri}`);
            api.rpc.state.getMetadata().then(() => {
                wsAPI = api;
                linking = false;
                return ck && ck(wsAPI);
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
            linking = false;
            return ck && ck(error);
        });
    },
    balance: (address, ck) => {
        let unsub = null;
        wsAPI.query.system.account(address, (res) => {
            if (unsub != null) unsub();
            const data = res.toJSON().data;
            return ck && ck(data);
        }).then((fun) => {
            unsub = fun;
        });
    },

    divide: () => {
        return 1000000000000;
    },
    load: (acc, password, ck) => {
        const keyring = new Keyring({ type: "sr25519" });
        const pair = keyring.createFromJson(acc);
        try {
            pair.decodePkcs8(password);
            return ck && ck(pair);
        } catch (error) {
            return ck && ck({ error: "Invalid passoword" });
        }
    },
    write: (pair, obj, ck) => {
        self.init(() => {
            let { anchor, raw, protocol } = obj;
            if (typeof protocol !== 'string') protocol = JSON.stringify(protocol);
            if (typeof raw !== 'string') raw = JSON.stringify(raw);
            if (funs.limited(anchor, raw, protocol)) return ck && ck({ error: "Params error" });

            const pre = 0;
            try {
                wsAPI.tx.anchor.setAnchor(anchor, raw, protocol, pre).signAndSend(pair, (res) => {
                    const dt = res.toHuman();
                    funs.decodeProcess(dt, (status) => {
                        return ck && ck(status);
                    });
                });
            } catch (error) {
                return ck && ck(error);
            }
        });
    },
}

module.exports = self;