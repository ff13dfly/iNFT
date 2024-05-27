const axios = require('axios');

const { config } = require('./config.js');
const { output } = require('./lib/output.js');
const tools = require('./lib/tools.js');
const IO = require('./lib/file.js');
const Tanssi = require('./lib/tanssi.js');

let round=0;

const overview={
    try:0,
    success:0,
    round:0,
};


const self = {
    getBasic: () => {
        return {
            index: 0,
            prefix: config.prefix,
            accounts: config.account,
            create: tools.stamp(),
            update: tools.stamp(),
        };
    },

    getRaw: (hash,offset) => {
        return {
            tpl: hash,          //ipfs cid
            offset: !offset?[]:offset,
            from: "ipfs",            //storage way
            origin: "web3.storage",   //storage origianl
        }
    },
    getProtocol: () => {
        return {
            type: "data",       //inft is type of data
            fmt: "json",        //json data
            tpl: "inft",        //inft format
        }
    },
    getMintOffset:(parts)=>{
        const os=[];
        for(let i=0;i<parts.length;i++){
            const part=parts[i];
            const divide=part.value[2];
            os.push(tools.rand(0,divide-1));
        }
        return os;
    },
    start: (ck) => {
        IO.read(config.basic, (res) => {
            if (!res.error) return ck && ck(res);
            const basic = self.getBasic();
            IO.save(config.basic, JSON.stringify(basic), (rs) => {
                if (!rs.error) return ck && ck(basic);
                return ck && ck({ error: "Failed to save basic setting." });
            });
        }, true);
    },
    load: (accounts, ck, pairs) => {
        if (pairs === undefined) pairs = {};
        if (accounts.length === 0) return ck && ck(pairs);
        const row = accounts.pop();
        const acc = row[0], password = row[1];
        const target = `./account/${acc}.json`;
        IO.read(target, (fa) => {
            if (fa.error) return self.load(accounts, ck, pairs);
            Tanssi.load(fa, password, (pair) => {
                if (pair.error) {
                    output(`Failed to decode account ${acc}`, 'error', true);
                    return self.load(accounts, ck, pairs);
                }
                output(`Load account '${acc}' successful.`, "success", true);
                pairs[acc] = pair;
                return self.load(accounts, ck, pairs);
            });
        }, true);
    },
    template: async (hash, ck) => {
        //const url = `https://${hash}${config.gateway}`;
        const url=`https://ipfs.w3os.net/${hash}`;
        output(`Fetching data from ${url}`, "", true);
        try {
            const response = await axios.get(url, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                  'Accept-Language': 'en-US,en;q=0.9',
                  'Accept-Encoding': 'gzip, deflate, br',
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                }
            });
            const json = response.data;
            json.cid=hash;
            output(`Got template successful.`, 'success', true);
            return ck && ck(json);
        } catch (error) {
            return ck && ck({ error: error });
        }
    },
    check: (pairs, ck) => {
        let count = 0;
        for (let acc in pairs) {
            count++;
            Tanssi.balance(acc, (res) => {
                count--;
                output(`Account ${acc} balance: ${res.free.toLocaleString()}`, 'success', true);
                if (res.free < config.low) {
                    output(`Low balance account ${acc}, removed.`, 'error', true);
                    delete pairs[acc];
                }
                if (count === 0) return ck && ck(pairs);
            });
        }
    },
    run: (pairs,tpl,cfg) => {
        output(`Round (${overview.round}) minting.`, "primary", true);
        const hash=tpl.cid;
        for (let acc in pairs) {
            cfg.index=cfg.index+1;
            const offset=self.getMintOffset(tpl.parts);
            const raw=self.getRaw(hash,offset);
            const protocol=self.getProtocol();
            const pair=pairs[acc];
            const name=`${cfg.prefix}${cfg.index}`;
            ((pair,name,raw,protocol)=>{
                output(`${name} started to mint.`);
                overview.try++;
                Tanssi.write(pair, { anchor: name, raw: raw, protocol: protocol }, (process) => {
                    output(`${name}:${JSON.stringify(process)}`);
                    if(process.status==="Finalized") overview.success++;
                });
            })(pair,name,raw,protocol);
        }
        
        return setTimeout(()=>{
            overview.round++;
            output(`Overview: ${JSON.stringify(overview)}`, "primary", true);
            //0,save the config to file
            if(overview.round%config.autosave===1){
                IO.save(config.basic, JSON.stringify(cfg), (rs) => {
                    output(`Setting saved.`, "success", true);
                });
            }

            //1.run minting task
            self.check(pairs, (pairs) => {
                self.run(pairs,tpl,cfg);
            });
        },config.interval);
    },
}

//0.load basic setting or init it;
output(`\n____________iNFT____________iNFT____________iNFT____________iNFT____________iNFT____________`, "success", true);
//output(`\n____________i___N___F___T______i___N___F___T______i___N___F___T______i___N___F___T____________`, "success", true);
output(`Start iNFT robot ( version ${config.version} ), author: Fuu, 2024.05`, "success", true);

process.on('unhandledRejection', (reason, promise) => {
    output(`UnhandledRejection`,'error');
    //console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});
  
process.on('uncaughtException', (error) => {
    output(`uncaughtException`,'error');
});

self.start((cfg) => {
    //0.update the index invoid to write the same anchor name;
    if(cfg.index!==0) cfg.index+=2*cfg.accounts.length;

    output(`Load robot setting from '${config.basic}' successful.`, "success", true);
    output(`Start to load accounts(${cfg.accounts.length}) for minting.`, "primary", true);
    //1.load all accounts from setting
    self.load(tools.clone(cfg.accounts), (accounts) => {
        //2.link to Tanssi node;
        output(`Linking to Tanssi node: ${config.node}`, "primary", true);
        Tanssi.init(() => {
            output(`Linked to Tanssi appchain node successful.`, "success", true);
            //3.check the balance, remove low balance accounts
            self.check(accounts, (pairs) => {
                // return  output(`No account to mint automatically.`,'error');

                output(`Checking template ${config.template} from '${config.gateway}'.`, "primary", true);
                self.template(config.template, (tpl) => {
                    //console.log(tpl);
                    if(tpl.error) return  output(`Failed to load template IPFS file.`,'error');
                    //console.log(tpl);
                    output(`Minting robot is ready to go in 2s...`, "success", true);
                    output(`____________iNFT____________iNFT____________iNFT____________iNFT____________iNFT____________`, "success", true);

                    //4.run minting task    
                    return setTimeout(()=>{
                        self.run(pairs,tpl,cfg);
                    },2000);
                });

            });

        }, config.node);
    });
});